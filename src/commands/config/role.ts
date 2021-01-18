import Crew from "../../classes/Crew";
import salty from "../../salty";
import { keywords } from "../../strings";
import { CommandDescriptor, RoleBox } from "../../typings";
import { getTargetMessage } from "../../utils/command";
import {
  clean,
  meaning,
  parseRoleBox,
  randColor,
  serializeRoleBox,
} from "../../utils/generic";

const PRIMARY_SEP = /\s*,\s*/;
const SECONDARY_SEP = /\s*=\s*/;

const CUSTOM_EMOJI_REGEX = /<:(\w+):\d{18}>/;

const command: CommandDescriptor = {
  name: "role",
  help: [
    {
      argument: null,
      effect: "Shows the current default role",
    },
    {
      argument: "set ***new role***",
      effect:
        "Sets the ***new role*** as the default one. If no existing role matches the name you provided, a new role will be created",
    },
    {
      argument: "unset",
      effect: "Removes the default role",
    },
  ],
  access: "admin",
  channel: "guild",

  async action({ args, msg, send }) {
    const guild = msg.guild!;
    const channel = msg.channel;
    const crew = await Crew.get(guild.id)!;

    switch (meaning(args[0])) {
      case "default": {
        args.shift();
        switch (meaning(args[0])) {
          case "add":
          case "set": {
            args.shift();
            if (!args.length) {
              return send.warn("You need to specify the name of the new role.");
            }
            const roleName = args.slice(0).join(" ");
            const role =
              msg.mentions.roles.first() ||
              msg.guild!.roles.cache.find((r) => r.name === roleName) ||
              false;
            if (!role) {
              const commandString = `\`$${this.name} ${keywords.add[0]} ${roleName}\``;
              return send.warn(
                `This role doesn't exist. You can create it with "${commandString}".`
              );
            }
            await Crew.update(crew.id, { defaultRole: role.id });
            return send.success(
              `Role **${role.name}** has been successfuly set as default role.`,
              { color: role.color }
            );
          }
          case "clear":
          case "remove": {
            if (!crew.defaultRole) {
              return send.warn("No default role to remove.");
            }
            await Crew.update(crew.id, { defaultRole: null });
            return send.success("default role has been successfuly removed");
          }
          default: {
            if (!crew.defaultRole) {
              return send.info("No default role set");
            } else {
              const role = guild.roles.cache.get(crew.defaultRole);
              return send.embed({
                title: `Default role is ${role?.name}`,
                description: "Newcomers will automatically get this role.",
                color: role?.color,
              });
            }
          }
        }
      }
      case "clear": {
        const toKeep: string[] = [];
        const toRemove: string[] = [];
        for (const roleBox of crew.roleBoxes) {
          const parsed = parseRoleBox(roleBox);
          if (parsed.channelId === channel.id) {
            toRemove.push(roleBox);
            salty.removeRoleBox(parsed);
          } else {
            toKeep.push(roleBox);
          }
        }
        Crew.update(crew.id, { roleBoxes: toKeep });
        return send.success("All role boxes have been removed on this channel");
      }
      case "remove": {
        const lastRoleBox = crew.roleBoxes.pop();
        if (!lastRoleBox) {
          return send.warn("No role box on this server");
        }
        const roleBox = parseRoleBox(lastRoleBox);
        salty.removeRoleBox(roleBox);
        Crew.update(crew.id, { roleBoxes: crew.roleBoxes });
        const boxChannel = guild.channels.cache.get(roleBox.channelId)!;
        return send.success(
          `Last role box has been removed. (In channel ${boxChannel.name})`
        );
      }
      default: {
        await salty.deleteMessage(msg);

        const targetMessage = await getTargetMessage(args, msg.channel.id);
        if (!targetMessage) {
          return send.warn("No message to react to");
        }

        const rawEmojiRoles = args
          .join(" ")
          .split(PRIMARY_SEP)
          .map((x) => x.split(SECONDARY_SEP));
        const emojiRoles: [string, string][] = [];

        for (const [emojiName, roleName] of rawEmojiRoles) {
          const cleanedRoleName = clean(roleName);
          let role = msg.guild!.roles.cache.find(
            (r) => clean(r.name) === cleanedRoleName
          );
          if (!role) {
            role = await msg.guild!.roles.create({
              name: roleName,
              mentionable: true,
              color: randColor(),
              permissions: [],
              reason: `Created by ${msg.author.username} via Salty`,
            });
          }
          let emoji = emojiName;
          const customEmojiMatch = emojiName.match(CUSTOM_EMOJI_REGEX);
          if (customEmojiMatch) {
            emoji = customEmojiMatch[1];
          }
          emojiRoles.push([emoji, role.id]);
        }

        const newBox: RoleBox = {
          channelId: targetMessage.channel.id,
          messageId: targetMessage.id,
          emojiRoles,
        };

        const boxIndex = crew.roleBoxes.findIndex(
          (r) => parseRoleBox(r).messageId === targetMessage.id
        );
        if (boxIndex < 0) {
          crew.roleBoxes.push(serializeRoleBox(newBox));
        } else {
          salty.removeRoleBox(parseRoleBox(crew.roleBoxes[boxIndex]));
          crew.roleBoxes[boxIndex] = serializeRoleBox(newBox);
        }

        Crew.update(crew.id, { roleBoxes: crew.roleBoxes });

        salty.addRoleBox(targetMessage, newBox);
      }
    }
  },
};

export default command;
