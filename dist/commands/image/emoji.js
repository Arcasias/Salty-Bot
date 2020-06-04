"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const emojiPath = "./assets/img/saltmoji";
const readDir = util_1.promisify(fs_1.default.readdir.bind(fs_1.default));
Command_1.default.register({
    name: "emoji",
    aliases: ["emojis", "saltmoji", "saltmojis"],
    category: "image",
    help: [
        {
            argument: null,
            effect: "Shows my emojis list",
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji",
        },
    ],
    async action({ args, msg }) {
        const files = await readDir(emojiPath);
        const pngs = files.filter((file) => file.split(".").pop() === "png");
        const emojiNames = pngs.map((name) => name.split(".").shift());
        if (args[0]) {
            const arg = args[0].toLowerCase();
            let emoji = null;
            if (["rand", "random"].includes(arg)) {
                emoji = utils_1.choice(emojiNames);
            }
            else if (emojiNames.includes(arg)) {
                emoji = arg;
            }
            if (emoji) {
                msg.delete();
                return Salty_1.default.message(msg, "", {
                    files: [`${emojiPath}/${emoji}.png`],
                });
            }
        }
        Salty_1.default.embed(msg, {
            title: "list of saltmojis",
            description: emojiNames.join("\n"),
        });
    },
});
