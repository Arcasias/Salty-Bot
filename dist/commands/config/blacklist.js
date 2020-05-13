"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
class BlackListCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "blacklist";
        this.keys = ["bl"];
        this.help = [
            {
                argument: null,
                effect: "Tells you wether you're an admin",
            },
            {
                argument: "***mention***",
                effect: "Tells you wether the ***mention*** is an admin",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg, args, target }) {
        const user = User_1.default.get(target.user.id);
        switch (this.meaning(args[0])) {
            case "add":
                if (!target.isMention) {
                    throw new Exception_1.MissingMention();
                }
                if (target.user.id === Salty_1.default.bot.user.id) {
                    return Salty_1.default.message(msg, "Woa woa woa! You can't just put me in my own blacklist you punk!");
                }
                if (Salty_1.default.isDev(target.user)) {
                    return Salty_1.default.message(msg, "Can't add a Salty dev to the blacklist: they're too nice for that!");
                }
                await User_1.default.update(user.id, { black_listed: true });
                await Salty_1.default.success(msg, `<mention> added to the blacklist`);
                break;
            case "remove":
                if (!target.isMention) {
                    throw new Exception_1.MissingMention();
                }
                if (target.user.id === Salty_1.default.bot.user.id) {
                    return Salty_1.default.message(msg, "Well... as you might expect, I'm not in the blacklist.");
                }
                if (!user.black_listed) {
                    throw new Exception_1.SaltyException(`**${target.member.nickname}** is not in the blacklist`);
                }
                await User_1.default.update(user.id, { black_listed: false });
                await Salty_1.default.success(msg, `<mention> removed from the blacklist`);
                break;
            default:
                if (target.isMention) {
                    if (target.user.id === Salty_1.default.bot.user.id) {
                        await Salty_1.default.message(msg, "Nope, I am not and will never be in the blacklist");
                    }
                    else {
                        await Salty_1.default.message(msg, user.black_listed
                            ? "<mention> is black-listed"
                            : "<mention> isn't black-listed... yet");
                    }
                }
                else {
                    const blackListedUsers = User_1.default.filter((u) => u.black_listed).map((u) => Salty_1.default.bot.users.cache.get(u.discord_id).username);
                    if (blackListedUsers.length) {
                        await Salty_1.default.embed(msg, {
                            title: "Blacklist",
                            description: blackListedUsers.join("\n"),
                        });
                    }
                    else {
                        await Salty_1.default.message(msg, "The black list is empty. You can help by *expanding it*.");
                    }
                }
        }
    }
}
exports.default = BlackListCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2tsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2NvbmZpZy9ibGFja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBa0U7QUFDbEUsdURBQXlFO0FBQ3pFLGdFQUF3QztBQUN4Qyw4REFBc0M7QUFFdEMsTUFBTSxnQkFBaUIsU0FBUSxpQkFBTztJQUF0Qzs7UUFDVyxTQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ25CLFNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGtDQUFrQzthQUM3QztZQUNEO2dCQUNJLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsZ0RBQWdEO2FBQzNEO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBaUZoRCxDQUFDO0lBL0VHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUM5QixNQUFNLElBQUksR0FBUyxjQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLEtBQUssS0FBSztnQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtvQkFDbkIsTUFBTSxJQUFJLDBCQUFjLEVBQUUsQ0FBQztpQkFDOUI7Z0JBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ3RDLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxFQUNILGtFQUFrRSxDQUNyRSxDQUFDO2lCQUNMO2dCQUNELElBQUksZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzFCLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxFQUNILG9FQUFvRSxDQUN2RSxDQUFDO2lCQUNMO2dCQUNELE1BQU0sY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztnQkFDN0QsTUFBTTtZQUNWLEtBQUssUUFBUTtnQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtvQkFDbkIsTUFBTSxJQUFJLDBCQUFjLEVBQUUsQ0FBQztpQkFDOUI7Z0JBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ3RDLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxFQUNILHdEQUF3RCxDQUMzRCxDQUFDO2lCQUNMO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNwQixNQUFNLElBQUksMEJBQWMsQ0FDcEIsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsNEJBQTRCLENBQzFELENBQUM7aUJBQ0w7Z0JBQ0QsTUFBTSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxzQ0FBc0MsQ0FDekMsQ0FBQztnQkFDRixNQUFNO1lBQ1Y7Z0JBQ0ksSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTt3QkFDdEMsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxtREFBbUQsQ0FDdEQsQ0FBQztxQkFDTDt5QkFBTTt3QkFDSCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILElBQUksQ0FBQyxZQUFZOzRCQUNiLENBQUMsQ0FBQywyQkFBMkI7NEJBQzdCLENBQUMsQ0FBQyxxQ0FBcUMsQ0FDOUMsQ0FBQztxQkFDTDtpQkFDSjtxQkFBTTtvQkFDSCxNQUFNLGdCQUFnQixHQUFHLGNBQUksQ0FBQyxNQUFNLENBQ2hDLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUM5QixDQUFDLEdBQUcsQ0FDRCxDQUFDLENBQU8sRUFBRSxFQUFFLENBQ1IsZUFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUN2RCxDQUFDO29CQUNGLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFO3dCQUN6QixNQUFNLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFOzRCQUNuQixLQUFLLEVBQUUsV0FBVzs0QkFDbEIsV0FBVyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7eUJBQzNDLENBQUMsQ0FBQztxQkFDTjt5QkFBTTt3QkFDSCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILDBEQUEwRCxDQUM3RCxDQUFDO3FCQUNMO2lCQUNKO1NBQ1I7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQyJ9