"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const PromiseManager_1 = __importDefault(require("../../classes/PromiseManager"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../data/list");
async function changeNames(msg, transformation) {
    const members = msg.guild.members.array();
    const progressMsg = await Salty_1.default.message(msg, `changing nicknames: 0/${members.length}`);
    const pm = new PromiseManager_1.default();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(members[i].nickname ? members[i].nickname : members[i].user.username);
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(progressMsg.edit.bind(progressMsg, `changing nicknames: ${i++}/${members.length}`));
            }
            catch (err) {
                if (err.name !== "DiscordAPIError" ||
                    err.message !== "Missing Permissions") {
                    throw err;
                }
            }
        }
        else {
            pm.add(progressMsg.edit.bind(progressMsg, `changing nicknames: ${i++}/${members.length}`));
        }
    }
    pm.add(progressMsg.delete.bind(progressMsg));
    Salty_1.default.success(msg, "nicknames successfully changed");
}
exports.default = new Command_1.default({
    name: "nickname",
    keys: ["name", "nick", "pseudo"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "add ***particle***",
            effect: "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters !",
        },
        {
            argument: "remove ***particle***",
            effect: "Removes the ***particle*** from each matching nickname",
        },
    ],
    visibility: "admin",
    async action(msg, args) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (!args[0]) {
            throw new Exception_1.MissingArg("add or delete + particle");
        }
        else {
            if (!particle) {
                throw new Exception_1.MissingArg("nickname particle");
            }
            if (list_1.add.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                    ? nickname
                    : `${nickname.trim()} ${particle}`);
            }
            else if (list_1.remove.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
            }
            else {
                throw new Exception_1.MissingArg("add or delete + particle");
            }
        }
    },
});