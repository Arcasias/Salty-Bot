"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../data/list");
exports.default = new Command_1.default({
    name: "waifu",
    keys: ["waifus"],
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ],
    visibility: "public",
    async action(msg) {
        const { name, anime, image } = utils_1.choice(list_1.waifus);
        await Salty_1.default.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: utils_1.choice(image) },
        });
    },
});
