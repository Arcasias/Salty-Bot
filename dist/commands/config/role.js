"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
function getRole(msg, roleName) {
    return (msg.mentions.roles.first() ||
        msg.guild.roles.cache.find((r) => r.name === roleName));
}
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
        switch (utils_1.meaning(args[0])) {
            case "default": {
                args.shift();
                switch (utils_1.meaning(args[0])) {
                    case "add":
                    case "set": {
                        args.shift();
                        if (!args.length) {
                            return salty_1.default.warn(msg, "You need to specify the name of the new role.");
                        }
                        const roleName = args.slice(0).join(" ");
                        const role = getRole(msg, roleName);
                        if (!role) {
                            const commandString = `\`$${this.name} ${terms_1.keywords.add[0]} ${roleName}\``;
                            return salty_1.default.warn(msg, `This role doesn't exist. You can create it with "${commandString}".`);
                        }
                        await Guild_1.default.update(dbGuild.id, {
                            default_role: role.id,
                        });
                        return salty_1.default.success(msg, `Role **${role.name}** has been successfuly set as default role.`, { color: role.color });
                    }
                    case "remove": {
                        if (!dbGuild.default_channel) {
                            return salty_1.default.info(msg, "No default role set.");
                        }
                        await Guild_1.default.update(dbGuild.id, { default_role: null });
                        return salty_1.default.success(msg, "default role has been successfuly removed");
                    }
                    default: {
                        if (!dbGuild.default_role) {
                            return salty_1.default.info(msg, "No default role set");
                        }
                        else {
                            const role = guild.roles.cache.get(dbGuild.default_role);
                            return salty_1.default.embed(msg, {
                                title: `Default role is ${role === null || role === void 0 ? void 0 : role.name}`,
                                description: "Newcomers will automatically get this role.",
                                color: role === null || role === void 0 ? void 0 : role.color,
                            });
                        }
                    }
                }
            }
            default: {
                switch (utils_1.meaning(args[0])) {
                    case "add": {
                        if (!salty_1.default.hasPermission(msg.guild, "MANAGE_ROLES")) {
                            return salty_1.default.warn(msg, "I'm not allowed to manage roles on this server.");
                        }
                        args.shift();
                        if (!args.length) {
                            return salty_1.default.warn(msg, "You need to specify the name of the new role.");
                        }
                        const roleName = args.slice(0).join(" ");
                        const role = getRole(msg, roleName);
                        if (role) {
                            return salty_1.default.warn(msg, "This role already exists.");
                        }
                        const newRole = await msg.guild.roles.create({
                            data: {
                                name: roleName,
                                mentionable: true,
                                color: utils_1.randColor(),
                            },
                            reason: `Created by ${msg.author.username} via Salty`,
                        });
                        return salty_1.default.success(msg, `Role **${newRole.name}** created.`, { color: newRole.color });
                    }
                    case "set": {
                        args.shift();
                        if (!args.length) {
                            return salty_1.default.warn(msg, "You need to specify the name of the role.");
                        }
                        const roleName = args.slice(0).join(" ");
                        let role = getRole(msg, roleName);
                        if (!role) {
                            if (!utils_1.isDev(msg.author)) {
                                const commandString = `\`$${this.name} ${terms_1.keywords.add[0]} ${roleName}\``;
                                return salty_1.default.warn(msg, `This role doesn't exist. You can create it with "${commandString}".`);
                            }
                            else {
                                role = await msg.guild.roles.create({
                                    data: {
                                        name: roleName,
                                        mentionable: true,
                                        color: utils_1.randColor(),
                                    },
                                    reason: `Created by ${msg.author.username} via Salty`,
                                });
                            }
                        }
                        msg.member.roles.add(role);
                        return salty_1.default.success(msg, `You have been assigned the role **${role.name}**.`, { color: role.color });
                    }
                    case "remove": {
                        if (!salty_1.default.hasPermission(msg.guild, "MANAGE_ROLES")) {
                            return salty_1.default.warn(msg, "I'm not allowed to manage roles on this server.");
                        }
                        args.shift();
                        const role = getRole(msg, args.join(" "));
                        if (!role) {
                            return salty_1.default.warn(msg, "You need to specify the name of the role to delete.");
                        }
                        role.delete("Deleted by Salty");
                        return salty_1.default.success(msg, `Role **${role.name}** deleted.`, { color: role.color });
                    }
                    default: {
                        const roles = msg
                            .member.roles.cache.map((r) => r.name)
                            .filter((n) => n !== "@everyone");
                        return salty_1.default.info(msg, "You have the following roles", {
                            description: roles.join("\n"),
                        });
                    }
                }
            }
        }
    },
});
