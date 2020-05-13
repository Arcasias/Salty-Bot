"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../list");
class RoleCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "role";
        this.keys = ["role"];
        this.help = [
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
        ];
        this.visibility = "dev";
    }
    async action({ msg, args }) {
        const { guild } = msg;
        const guildDBId = Guild_1.default.get(guild.id).id;
        if (args[0] && list_1.add.includes(args[0])) {
            if (!args[1]) {
                throw new Exception_1.MissingArg("new role");
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
                const role = guild.roles.cache.get(Guild_1.default.get(guild.id).default_role);
                Salty_1.default.embed(msg, {
                    title: `default role is ${role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role.color,
                });
            }
        }
    }
}
exports.default = RoleCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBa0U7QUFDbEUsdURBSWlDO0FBQ2pDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMscUNBQXlDO0FBRXpDLE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsZ0NBQWdDO2FBQzNDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsTUFBTSxFQUNGLDJIQUEySDthQUNsSTtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsMEJBQTBCO2FBQ3JDO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBa0VoRCxDQUFDO0lBaEVHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDdEIsTUFBTSxTQUFTLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRXpDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENB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