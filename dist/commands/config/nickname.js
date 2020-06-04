"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const PromiseManager_1 = __importDefault(require("../../classes/PromiseManager"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
async function changeNames(msg, transformation) {
    const members = msg.guild.members.cache.array();
    const progressMsg = await Salty_1.default.message(msg, `changing nicknames: 0/${members.length}`);
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
    Salty_1.default.success(msg, "nicknames successfully changed");
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
        if (terms_1.add.includes(args[0])) {
            await changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                ? nickname
                : `${nickname.trim()} ${particle}`);
        }
        else if (terms_1.remove.includes(args[0])) {
            await changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
        }
        else if (args.length) {
            return Salty_1.default.warn(msg, "You need to specify what nickname particle will be targeted.");
        }
        else {
            return Salty_1.default.warn(msg, "You need to tell whether to add or delete a global nickname particle.");
        }
    },
});
