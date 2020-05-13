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
        this.keys = ["blackls", "bl"];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2tsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2NvbmZpZy9ibGFja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBa0U7QUFDbEUsdURBQXlFO0FBQ3pFLGdFQUF3QztBQUN4Qyw4REFBc0M7QUFFdEMsTUFBTSxnQkFBaUIsU0FBUSxpQkFBTztJQUF0Qzs7UUFDVyxTQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ25CLFNBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsa0NBQWtDO2FBQzdDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSxnREFBZ0Q7YUFDM0Q7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixLQUFLLENBQUM7SUFpRmhELENBQUM7SUEvRUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQzlCLE1BQU0sSUFBSSxHQUFTLGNBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxLQUFLO2dCQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO29CQUNuQixNQUFNLElBQUksMEJBQWMsRUFBRSxDQUFDO2lCQUM5QjtnQkFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtvQkFDdEMsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUNoQixHQUFHLEVBQ0gsa0VBQWtFLENBQ3JFLENB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