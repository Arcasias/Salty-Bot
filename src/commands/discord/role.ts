import Command from "../../classes/Command";
import {
    MissingArg,
    PermissionDenied,
    SaltyException,
} from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { add, remove } from "../../data/list";

export default new Command({
    name: "role",
    keys: ["role"],
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
    visibility: "dev",
    async action(msg, args) {
        const { guild } = msg;
        const guildDBId = Guild.get(guild.id).id;

        if (args[0] && add.includes(args[0])) {
            if (!args[1]) {
                throw new MissingArg("new role");
            }
            let role = msg.mentions.roles.first();
            const roleName = args.slice(1).join(" ");
            if (!role) {
                role = guild.roles.find((r) => r.name === roleName);
            }
            if (!role) {
                try {
                    role = await guild.createRole({
                        name: roleName,
                        color: "#1eff00",
                    });
                    await Guild.update(guildDBId, { default_role: role.id });
                    await Salty.success(
                        msg,
                        `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`
                    );
                } catch (error) {
                    throw new PermissionDenied(
                        "authorized to create new roles",
                        "I"
                    );
                }
            } else {
                await Guild.update(guildDBId, { default_role: role.id });
                await Salty.success(
                    msg,
                    `role **${role.name}** has been successfuly set as default role for **${guild.name}**`
                );
            }
        } else if (args[0] && remove.includes(args[0])) {
            if (!Guild.get(guild.id).default_channel) {
                throw new SaltyException("no default role set");
            }
            await Guild.update(guildDBId, { default_role: null });
            await Salty.success(
                msg,
                "default role has been successfuly removed"
            );
        } else {
            if (!Guild.get(guild.id).default_role) {
                return Salty.message(msg, "No default role set");
            } else {
                const role = guild.roles.get(Guild.get(guild.id).default_role);
                Salty.embed(msg, {
                    title: `default role is ${role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role.color,
                });
            }
        }
    },
});
