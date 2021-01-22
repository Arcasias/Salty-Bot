import Crew from "../../classes/Crew";
import salty from "../../salty";
import { keywords } from "../../strings";
import { CommandDescriptor, RoleBox } from "../../typings";
import { getTargetMessage } from "../../utils/command";
import {
  isSnowflake,
  meaning,
  parseRoleBox,
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
      argument: "default set `role name`",
      effect:
        "Sets the `role name` as the default one. This means that all newcomers will be assigned to that role automatically",
    },
    {
      argument: "default unset",
      effect:
        "Stops the automatic assignation of a default role on this server.",
    },
    {
      argument:
        "`channel id (optional)` `message id` `emoji` = `role id`, `emoji` = `role id`, etc.",
      effect:
        `Creates a **role box** on a target message. A role box is a subscription system bound to a message.` +
        `I will first react to the target message with each of the emojis you mentioned.` +
        `All users will then be able to assign/unassign themselves with the roles linked to each emoji`,
      example: {
        command: `111111111111111111 222222222222222222 :flag_be: = 333333333333333333`,
        result: `A :flag_be: emoji will be added on the message "222..." in the channel "111..." and each user clicking on this reaction will be assigned the role having the id "333..." (provided it exists!)`,
      },
    },
    {
      argument: "remove `channel id (optional)` `message id`",
      effect:
        "Removes the role box on the target message (if any). This will also remove ALL reactions on that message",
    },
  ],
  access: "admin",
  channel: "guild",
  permissions: ["MANAGE_ROLES"],

  async action({ args, msg, send }) {
    const guild = msg.guild!;
    const crew = await Crew.get(guild.id)!;
    const defaultRole = crew.getDefaultRole(guild);

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
            await crew.update({ defaultRole: role.id });
            return send.success(
              `Role **${role.name}** has been successfuly set as default role.`,
              { color: role.color }
            );
          }
          case "clear":
          case "remove": {
            if (!defaultRole) {
              return send.warn("No default role to remove.");
            }
            await crew.update({ defaultRole: null });
            return send.success("Default role has been successfuly removed");
          }
          default: {
            if (!defaultRole) {
              return send.info("No default role set");
            }
            return send.embed({
              title: `Default role is ${defaultRole.name}`,
              description: "Newcomers will automatically get this role.",
              color: defaultRole.color,
            });
          }
        }
      }
      case "remove": {
        args.shift();
        const targetMessage = await getTargetMessage(args, msg.channel.id);
        if (!targetMessage) {
          return send.warn(
            "Message not found: you have to give me the channel id and the message id for me to find it"
          );
        }
        const roleBox = crew.roleBoxes.find(
          (r) => parseRoleBox(r).messageId === targetMessage.id
        );
        if (!roleBox) {
          return send.warn("No role box on that message");
        }
        targetMessage.reactions.removeAll().catch();
        salty.removeRoleBox(targetMessage.channel.id, targetMessage.id);
        Crew.update(crew.id, { roleBoxes: crew.roleBoxes });
        return send.success(
          `Role box removed from message ${targetMessage.url}`
        );
      }
      default: {
        const targetMessage = await getTargetMessage(args, msg.channel.id);
        if (!targetMessage) {
          return send.warn(
            "Message not found: you have to give me the channel id and the message id for me to find it"
          );
        }

        const rawEmojiRoles = args
          .join(" ")
          .split(PRIMARY_SEP)
          .map((x) => x.split(SECONDARY_SEP));
        const emojiRoles: [string, string][] = [];

        for (const [emojiName, roleId] of rawEmojiRoles) {
          if (!isSnowflake(roleId)) {
            return send.warn(`Invalid role id: ${roleId}`);
          }
          let emoji = emojiName;
          const customEmojiMatch = emojiName.match(CUSTOM_EMOJI_REGEX);
          if (customEmojiMatch) {
            emoji = customEmojiMatch[1];
          }
          emojiRoles.push([emoji, roleId]);
        }

        await targetMessage.reactions.removeAll().catch();

        const newBox: RoleBox = {
          channelId: targetMessage.channel.id,
          messageId: targetMessage.id,
          emojiRoles,
        };
        const serializedBox = serializeRoleBox(newBox);
        const parsedBoxes = crew.roleBoxes.map(parseRoleBox);
        const boxIndex = parsedBoxes.findIndex(
          (roleBox) => roleBox.messageId === targetMessage.id
        );
        if (boxIndex < 0) {
          crew.roleBoxes.push(serializedBox);
        } else {
          salty.removeRoleBox(newBox.channelId, newBox.messageId);
          crew.roleBoxes[boxIndex] = serializedBox;
        }

        await Promise.all([
          Crew.update(crew.id, { roleBoxes: crew.roleBoxes }),
          salty.addRoleBox(targetMessage, newBox),
        ]);
        return send.success(`Role box added on message ${targetMessage.url}`);
      }
    }
  },
};

export default command;
