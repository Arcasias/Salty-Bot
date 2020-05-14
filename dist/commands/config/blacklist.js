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
        this.access = "dev";
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
                    throw new Exception_1.SaltyException(`**${target.name}** is not in the blacklist`);
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
                        await Salty_1.default.message(msg, (user === null || user === void 0 ? void 0 : user.black_listed) ? "<mention> is black-listed"
                            : "<mention> isn't black-listed... yet");
                    }
                }
                else {
                    const blackListedUsers = User_1.default.filter((u) => u.black_listed).map((u) => { var _a; return (_a = Salty_1.default.bot.users.cache.get(u.discord_id)) === null || _a === void 0 ? void 0 : _a.username; });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2tsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2NvbmZpZy9ibGFja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBOEU7QUFDOUUsdURBQXlFO0FBQ3pFLGdFQUF3QztBQUN4Qyw4REFBc0M7QUFFdEMsTUFBTSxnQkFBaUIsU0FBUSxpQkFBTztJQUF0Qzs7UUFDVyxTQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ25CLFNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGtDQUFrQzthQUM3QztZQUNEO2dCQUNJLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsZ0RBQWdEO2FBQzNEO1NBQ0osQ0FBQztRQUNLLFdBQU0sR0FBa0IsS0FBSyxDQUFDO0lBaUZ6QyxDQUFDO0lBL0VHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBaUI7UUFDN0MsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzQixLQUFLLEtBQUs7Z0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQ25CLE1BQU0sSUFBSSwwQkFBYyxFQUFFLENBQUM7aUJBQzlCO2dCQUNELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFO29CQUN2QyxPQUFPLGVBQUssQ0FBQyxPQUFPLENBQ2hCLEdBQUcsRUFDSCxrRUFBa0UsQ0FDckUsQ0FBQztpQkFDTDtnQkFD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