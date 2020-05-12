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
const config_1 = require("../../config");
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
    async action({ msg, target }) {
        const options = {
            title: `this is ${utils_1.possessive(target.member.displayName)} profile pic`,
            color: target.member.displayColor,
        };
        if (target.user.id === Salty_1.default.bot.user.id) {
            const files = fs_1.default.readdirSync("assets/img/salty");
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.files = [path_1.default.join("assets/img/salty/", utils_1.choice(pics))];
        }
        else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot";
            }
            else if (target.user.id === config_1.owner.id) {
                options.description = "He's the coolest guy i know ^-^";
            }
            else if (Salty_1.default.isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit";
            }
            else {
                options.description = "This is a huge piece of shit";
            }
            options.image = { url: target.user.avatarURL({ size: 1024 }) };
        }
        await Salty_1.default.embed(msg, options);
    },
});
