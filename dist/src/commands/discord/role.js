"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../data/list");
exports.default = new Command_1.default({
    name: "role",
    keys: ["role"],
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
    visibility: "dev",
    async action(msg, args) {
        const { guild } = msg;
        const guildDBId = Guild_1.default.get(guild.id).id;
        if (args[0] && list_1.add.includes(args[0])) {
            if (!args[1]) {
                throw new Exception_1.MissingArg("new role");
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
                    await Guild_1.default.update(guildDBId, { default_role: role.id });
                    await Salty_1.default.success(msg, `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`);
                }
                catch (error) {
                    throw new Exception_1.PermissionDenied("authorized to create new roles", "I");
                }
            }
            else {
                await Guild_1.default.update(guildDBId, { default_role: role.id });
                await Salty_1.default.success(msg, `role **${role.name}** has been successfuly set as default role for **${guild.name}**`);
            }
        }
        else if (args[0] && list_1.remove.includes(args[0])) {
            if (!Guild_1.default.get(guild.id).default_channel) {
                throw new Exception_1.SaltyException("no default role set");
            }
            await Guild_1.default.update(guildDBId, { default_role: null });
            await Salty_1.default.success(msg, "default role has been successfuly removed");
        }
        else {
            if (!Guild_1.default.get(guild.id).default_role) {
                return Salty_1.default.message(msg, "No default role set");
            }
            else {
                const role = guild.roles.get(Guild_1.default.get(guild.id).default_role);
                Salty_1.default.embed(msg, {
                    title: `default role is ${role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role.color,
                });
            }
        }
    },
});
