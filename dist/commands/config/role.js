"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
Command_1.default.register({
    name: "role",
    category: "config",
    help: [
        {
            argument: null,
            effect: "Shows the current default role",
        },
        {
            argument: "set ***new role***",
            effect: "Sets the ***new role*** as the default one. If no existing role matches the name you provided, a new role will be created",
        },
        {
            argument: "unset",
            effect: "Removes the default role",
        },
    ],
    access: "dev",
    channel: "guild",
    async action({ args, msg }) {
        const guild = msg.guild;
        const dbGuild = Guild_1.default.get(guild.id);
        if (args[0] && terms_1.add.includes(args[0])) {
            if (!args[1]) {
                return Salty_1.default.warn(msg, "You need to specify the name of the new role");
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
                    await Guild_1.default.update(dbGuild.id, { default_role: role.id });
                    await Salty_1.default.success(msg, `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`);
                }
                catch (error) {
                    return Salty_1.default.warn(msg, "I'm not allowed to create new roles.");
                }
            }
            else {
                await Guild_1.default.update(dbGuild.id, { default_role: role.id });
                await Salty_1.default.success(msg, `role **${role.name}** has been successfuly set as default role for **${guild.name}**`);
            }
        }
        else if (args[0] && terms_1.remove.includes(args[0])) {
            if (!dbGuild.default_channel) {
                return Salty_1.default.warn(msg, "No default role set.");
            }
            await Guild_1.default.update(dbGuild.id, { default_role: null });
            await Salty_1.default.success(msg, "default role has been successfuly removed");
        }
        else {
            if (!dbGuild.default_role) {
                return Salty_1.default.message(msg, "No default role set");
            }
            else {
                const role = guild.roles.cache.get(dbGuild.default_role);
                Salty_1.default.embed(msg, {
                    title: `default role is ${role === null || role === void 0 ? void 0 : role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role === null || role === void 0 ? void 0 : role.color,
                });
            }
        }
    },
});
