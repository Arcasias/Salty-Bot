"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "waifu",
    aliases: ["waifus"],
    category: "image",
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ],
    async action({ msg }) {
        const { name, anime, image } = utils_1.choice(terms_1.waifus);
        await salty_1.default.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: utils_1.choice(image) },
        });
    },
});
