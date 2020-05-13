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
        this.visibility = "dev";
    }
    async action({ args, msg }) {
        const { guild } = msg;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFHK0I7QUFDL0IsdURBSWlDO0FBQ2pDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQTBDO0FBRTFDLE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsZ0NBQWdDO2FBQzNDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsTUFBTSxFQUNGLDJIQUEySDthQUNsSTtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsMEJBQTBCO2FBQ3JDO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBa0VoRCxDQUFDO0lBaEVHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLE1BQU0sU0FBUyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV6QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLHNCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDcEM7WUFDRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNQLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUM7YUFDN0Q7WUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNQLElBQUk7b0JBQ0EsSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7d0JBQzVCLElBQUksRUFBRTs0QkFDRixJQUFJLEVBQUUsUUFBUTs0QkFDZCxLQUFLLEVBQUUsU0FBUzt5QkFDbkI7d0JBQ0QsTUFBTSxFQUFFLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7cUJBQzlDLENBQUMsQ0FBQztvQkFDSCxNQUFNLGVBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN6RCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILFVBQVUsSUFBSSxDQUFDLElBQUksaUVBQWlFLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FDckcsQ0FBQztpQkFDTDtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixNQUFNLElBQUksNEJBQWdCLENBQ3RCLGdDQUFnQyxFQUNoQyxHQUFHLENBQ04sQ0FBQztpQkFDTDthQUNKO2lCQUFNO2dCQUNILE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsVUFBVSxJQUFJLENBQUMsSUFBSSxxREFBcUQsS0FBSyxDQUFDLElBQUksSUFBSSxDQUN6RixDQUFDO2FBQ0w7U0FDSjthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRTtnQkFDdEMsTUFBTSxJQUFJLDBCQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUNuRDtZQUNELE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN0RCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILDJDQUEyQyxDQUM5QyxDQUFDO1NBQ0w7YUFBTTtZQUNILElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLEVBQUU7Z0JBQ25DLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUMsQ0FBQzthQUNwRDtpQkFBTTtnQkFDSCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQzlCLGVBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FDbkMsQ0FBQztnQkFDRixlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDYixLQUFLLEVBQUUsbUJBQW1CLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ3JDLFdBQVcsRUFBRSw0Q0FBNEM7b0JBQ3pELEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztpQkFDcEIsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFdBQVcsQ0FBQyJ9