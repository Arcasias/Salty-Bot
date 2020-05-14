"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
class RoleCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "role";
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
        this.access = "dev";
        this.channel = "guild";
    }
    async action({ args, msg }) {
        var _a, _b;
        const guild = msg.guild;
        const guildDBId = Guild_1.default.get(guild.id).id;
        if (args[0] && terms_1.add.includes(args[0])) {
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
        else if (args[0] && terms_1.remove.includes(args[0])) {
            if (!((_a = Guild_1.default.get(guild.id)) === null || _a === void 0 ? void 0 : _a.default_channel)) {
                throw new Exception_1.SaltyException("no default role set");
            }
            await Guild_1.default.update(guildDBId, { default_role: null });
            await Salty_1.default.success(msg, "default role has been successfuly removed");
        }
        else {
            if (!((_b = Guild_1.default.get(guild.id)) === null || _b === void 0 ? void 0 : _b.default_role)) {
                return Salty_1.default.message(msg, "No default role set");
            }
            else {
                const role = guild.roles.cache.get(Guild_1.default.get(guild.id).default_role);
                Salty_1.default.embed(msg, {
                    title: `default role is ${role === null || role === void 0 ? void 0 : role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role === null || role === void 0 ? void 0 : role.color,
                });
            }
        }
    }
}
exports.default = RoleCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFJK0I7QUFDL0IsdURBSWlDO0FBQ2pDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQTBDO0FBRTFDLE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsZ0NBQWdDO2FBQzNDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsTUFBTSxFQUNGLDJIQUEySDthQUNsSTtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsMEJBQTBCO2FBQ3JDO1NBQ0osQ0FBQztRQUNLLFdBQU0sR0FBa0IsS0FBSyxDQUFDO1FBQzlCLFlBQU8sR0FBbUIsT0FBTyxDQUFDO0lBa0U3QyxDQUFDO0lBaEVHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjs7UUFDckMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQU0sQ0FBQztRQUN6QixNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUM7UUFFMUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxzQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3BDO1lBQ0QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENB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