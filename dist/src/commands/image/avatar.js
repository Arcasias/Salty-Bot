"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
exports.default = new Command_1.default({
    name: "avatar",
    keys: ["pic", "picture", "pp"],
    help: [
        {
            argument: null,
            effect: "Shows a bigger version of your profile picture",
        },
        {
            argument: "***mention***",
            effect: "Shows a bigger version of ***mention***'s profile picture",
        },
    ],
    visibility: "public",
    async action(msg) {
        const mention = msg.mentions.users.first();
        const targetUser = mention ? mention : msg.author;
        const name = mention ? mention.displayName : msg.member.displayName;
        const color = mention
            ? mention.highestRole.color
            : msg.member.highestRole.color;
        let desc = "This is a huge piece of shit";
        if (targetUser.bot) {
            desc = "That's just a crappy bot";
        }
        else if (targetUser.id === Salty_1.default.config.owner.id) {
            desc = "He's the coolest guy i know ^-^";
        }
        else if (Salty_1.default.isAdmin(targetUser, msg.guild)) {
            desc = "It's a cute piece of shit";
        }
        const options = {
            title: `this is ${utils_1.possessive(name)} profile pic`,
        };
        if (targetUser.id === Salty_1.default.bot.user.id) {
            const files = fs_1.default.readdirSync("assets/img/salty");
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.file = path_1.default.join("assets/img/salty/", utils_1.choice(pics));
        }
        else {
            options.image = targetUser.avatarURL;
            options.color = parseInt(color);
            options.description = desc;
        }
        await Salty_1.default.embed(msg, options);
    },
});
