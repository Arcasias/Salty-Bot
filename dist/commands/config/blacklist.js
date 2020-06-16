"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const User_1 = __importDefault(require("../../classes/User"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "blacklist",
    aliases: ["bl"],
    category: "config",
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
            case "set": {
                if (!target.isMention) {
                    return salty_1.default.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === salty_1.default.bot.user.id) {
                    return salty_1.default.warn(msg, "Woa woa woa! You can't just put me in my own blacklist you punk!");
                }
                if (utils_1.isDev(target.user)) {
                    return salty_1.default.warn(msg, "Can't add a Salty dev to the blacklist: they're too nice for that!");
                }
                await User_1.default.update(user.id, { black_listed: true });
                return salty_1.default.success(msg, `<mention> added to the blacklist`);
            }
            case "remove": {
                if (!target.isMention) {
                    return salty_1.default.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === salty_1.default.bot.user.id) {
                    return salty_1.default.info(msg, "Well... as you might expect, I'm not in the blacklist.");
                }
                if (!user.black_listed) {
                    return salty_1.default.info(msg, `**${target.name}** is not in the blacklist.`);
                }
                await User_1.default.update(user.id, { black_listed: false });
                return salty_1.default.success(msg, `<mention> removed from the blacklist`);
            }
            default: {
                if (target.isMention && target.user.id === salty_1.default.bot.user.id) {
                    return salty_1.default.info(msg, "Nope, I am not and will never be in the blacklist");
                }
                if (target.isMention) {
                    return salty_1.default.info(msg, (user === null || user === void 0 ? void 0 : user.black_listed) ? "<mention> is black-listed"
                        : "<mention> isn't black-listed... yet");
                }
                const blackListedUsers = User_1.default.filter((u) => u.black_listed).map((u) => { var _a; return (_a = salty_1.default.bot.users.cache.get(u.discord_id)) === null || _a === void 0 ? void 0 : _a.username; });
                if (blackListedUsers.length) {
                    return salty_1.default.embed(msg, {
                        title: "Blacklist",
                        description: blackListedUsers.join("\n"),
                    });
                }
                return salty_1.default.info(msg, "The black list is empty. You can help by *expanding it*.");
            }
        }
    },
});
