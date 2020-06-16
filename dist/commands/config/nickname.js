"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const PromiseManager_1 = __importDefault(require("../../classes/PromiseManager"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
async function changeNames(msg, transformation) {
    const members = msg.guild.members.cache.array();
    const progressMsg = await salty_1.default.message(msg, `changing nicknames: 0/${members.length}`);
    const pm = new PromiseManager_1.default();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(members[i].displayName);
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(progressMsg.edit.bind(progressMsg, {
                    content: `changing nicknames: ${i++}/${members.length}`,
                }));
            }
            catch (err) {
                if (err.name !== "DiscordAPIError" ||
                    err.message !== "Missing Permissions") {
                    throw err;
                }
            }
        }
        else {
            pm.add(progressMsg.edit.bind(progressMsg, {
                content: `changing nicknames: ${i++}/${members.length}`,
            }));
        }
    }
    pm.add(progressMsg.delete.bind(progressMsg));
    return salty_1.default.success(msg, "nicknames successfully changed");
}
Command_1.default.register({
    name: "nickname",
    aliases: ["name", "nick", "pseudo"],
    category: "config",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "add ***particle***",
            effect: "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters!",
        },
        {
            argument: "remove ***particle***",
            effect: "Removes the ***particle*** from each matching nickname",
        },
    ],
    access: "admin",
    channel: "guild",
    async action({ args, msg }) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        switch (utils_1.meaning(args[0])) {
            case "add":
            case "set": {
                return changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                    ? nickname
                    : `${nickname.trim()} ${particle}`);
            }
            case "remove": {
                return changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
            }
            case "string": {
                return salty_1.default.warn(msg, "You need to specify what nickname particle will be targeted.");
            }
            default: {
                return salty_1.default.warn(msg, "You need to tell whether to add or delete a global nickname particle.");
            }
        }
    },
});
