"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
const SALTY_IMAGES_PATH = "assets/img/salty";
Command_1.default.register({
    name: "avatar",
    aliases: ["pic", "picture", "pp"],
    category: "image",
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
    async action({ msg, target }) {
        var _a;
        const options = {
            title: `this is ${utils_1.possessive(target.name)} profile pic`,
            color: (_a = target.member) === null || _a === void 0 ? void 0 : _a.displayColor,
        };
        if (target.user.id === salty_1.default.bot.user.id) {
            const files = fs_1.default.readdirSync(SALTY_IMAGES_PATH);
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `This is a picture of me. `;
            options.files = [path_1.default.join(SALTY_IMAGES_PATH, utils_1.choice(pics))];
        }
        else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot";
            }
            else if (utils_1.isOwner(target.user)) {
                options.description = "He's the coolest guy i know ^-^";
            }
            else if (msg.guild && utils_1.isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit";
            }
            else {
                options.description = "This is a huge piece of shit";
            }
            const url = target.user.avatarURL({ size: 1024 });
            if (url) {
                options.image = { url };
            }
        }
        await salty_1.default.embed(msg, options);
    },
});
