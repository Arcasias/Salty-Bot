"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "blacklist",
    keys: ["bl"],
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ],
    access: "dev",
    async action({ msg, args, target }) {
        const user = User_1.default.get(target.user.id);
        switch (utils_1.meaning(args[0])) {
            case "add":
                if (!target.isMention) {
                    return Salty_1.default.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === Salty_1.default.bot.user.id) {
                    return Salty_1.default.message(msg, "Woa woa woa! You can't just put me in my own blacklist you punk!");
                }
                if (utils_1.isDev(target.user)) {
                    return Salty_1.default.message(msg, "Can't add a Salty dev to the blacklist: they're too nice for that!");
                }
                await User_1.default.update(user.id, { black_listed: true });
                await Salty_1.default.success(msg, `<mention> added to the blacklist`);
                break;
            case "remove":
                if (!target.isMention) {
                    return Salty_1.default.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === Salty_1.default.bot.user.id) {
                    return Salty_1.default.message(msg, "Well... as you might expect, I'm not in the blacklist.");
                }
                if (!user.black_listed) {
                    return Salty_1.default.warn(msg, `**${target.name}** is not in the blacklist.`);
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
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2tsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2NvbmZpZy9ibGFja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx1Q0FBNkM7QUFFN0MsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGtDQUFrQztTQUM3QztRQUNEO1lBQ0ksUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLGdEQUFnRDtTQUMzRDtLQUNKO0lBQ0QsTUFBTSxFQUFFLEtBQUs7SUFFYixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ3ZDLFFBQVEsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLEtBQUssS0FBSztnQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtvQkFDbkIsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO2lCQUMxRDtnQkFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUNoQixHQUFHLEVBQ0gsa0VBQWtFLENBQ3JFLENBQUM7aUJBQ0w7Z0JBQ0QsSUFBSSxhQUFLLENBQUMsTUFBTSxDQUFDLElBQUks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