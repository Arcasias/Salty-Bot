import { Message, Role } from "discord.js";
import Crew from "../../classes/Crew";
import salty from "../../salty";
import { keywords } from "../../strings";
import { CommandDescriptor } from "../../typings";
import { apiCatch, isDev, meaning, randColor } from "../../utils/generic";

function getRole(msg: Message, roleName: string): Role | false {
  return (
    msg.mentions.roles.first() ||
    msg.guild!.roles.cache.find((r) => r.name === roleName) ||
    false
  );
}

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
            const role = getRole(msg, roleName);
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
      default: {
        switch (meaning(args[0])) {
          // Not default
          case "add": {
            if (!salty.hasPermission(msg.guild!, "MANAGE_ROLES")) {
              return send.warn(
                "I'm not allowed to manage roles on this server."
              );
            }
            args.shift();
            if (!args.length) {
              return send.warn("You need to specify the name of the new role.");
            }
            const roleName = args.slice(0).join(" ");
            const role = getRole(msg, roleName);
            if (role) {
              return send.warn("This role already exists.");
            }
            const newRole = await msg.guild!.roles.create({
              data: {
                name: roleName,
                mentionable: true,
                color: randColor(),
                permissions: [],
              },
              reason: `Created by ${msg.author.username} via Salty`,
            });
            return send.success(`Role **${newRole.name}** created.`, {
              color: newRole.color,
            });
          }
          case "set": {
            args.shift();
            if (!args.length) {
              return send.warn("You need to specify the name of the role.");
            }
            const roleName = args.slice(0).join(" ");
            let role = getRole(msg, roleName);
            if (!role) {
              if (!isDev(msg.author)) {
                const commandString = `\`$${this.name} ${keywords.add[0]} ${roleName}\``;
                return send.warn(
                  `This role doesn't exist. You can create it with "${commandString}".`
                );
              } else {
                role = await apiCatch(() =>
                  msg.guild!.roles.create({
                    data: {
                      name: roleName,
                      mentionable: true,
                      color: randColor(),
                    },
                    reason: `Created by ${msg.author.username} via Salty`,
                  })
                );
              }
            }
            if (role) {
              const ensuredRole: Role = role;
              apiCatch(() => msg.member!.roles.add(ensuredRole));
              return send.success(
                `You have been assigned the role **${role.name}**.`,
                { color: role.color }
              );
            }
          }
          case "remove": {
            if (!salty.hasPermission(msg.guild!, "MANAGE_ROLES")) {
              return send.warn(
                "I'm not allowed to manage roles on this server."
              );
            }
            args.shift();
            const role = getRole(msg, args.join(" "));
            if (!role) {
              return send.warn(
                "You need to specify the name of the role to delete."
              );
            }
            apiCatch(() => role.delete("Deleted by Salty"));
            return send.success(`Role **${role.name}** deleted.`, {
              color: role.color,
            });
          }
          default: {
            const roles = msg
              .member!.roles.cache.map((r) => r.name)
              .filter((n) => n !== "@everyone");
            return send.info("You have the following roles", {
              description: roles.join("\n"),
            });
          }
        }
      }
    }
  },
};

export default command;
