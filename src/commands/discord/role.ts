import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { add, remove } from "../../terms";

Command.register({
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
    access: "dev",
    channel: "guild",

    async action({ args, msg }) {
        const guild = msg.guild!;
        const dbGuild = Guild.get(guild.id)!;

        if (args[0] && add.includes(args[0])) {
            if (!args[1]) {
                return Salty.warn(
                    msg,
                    "You need to specify the name of the new role"
                );
            }
            let role = msg.mentions.roles.first();
            const roleName = args.slice(1).join(" ");
            if (!role) {
                role = guild.roles.cache.find((r) => r.name === roleName);
            }
            if (!role) {
                try {
                    role = await guild.roles.create({
                        data: {
                            name: roleName,
                            color: "#1eff00",
                        },
                        reason: `Created by ${msg.author.username}`,
                    });
                    await Guild.update(dbGuild.id, { default_role: role.id });
                    await Salty.success(
                        msg,
                        `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`
                    );
                } catch (error) {
                    return Salty.warn(
                        msg,
                        "I'm not allowed to create new roles."
                    );
                }
            } else {
                await Guild.update(dbGuild.id, { default_role: role.id });
                await Salty.success(
                    msg,
                    `role **${role.name}** has been successfuly set as default role for **${guild.name}**`
                );
            }
        } else if (args[0] && remove.includes(args[0])) {
            if (!dbGuild.default_channel) {
                return Salty.warn(msg, "No default role set.");
            }
            await Guild.update(dbGuild.id, { default_role: null });
            await Salty.success(
                msg,
                "default role has been successfuly removed"
            );
        } else {
            if (!dbGuild.default_role) {
                return Salty.message(msg, "No default role set");
            } else {
                const role = guild.roles.cache.get(dbGuild.default_role);
                Salty.embed(msg, {
                    title: `default role is ${role?.name}`,
                    description: "newcomers will automatically get this role",
                    color: role?.color,
                });
            }
        }
    },
});
