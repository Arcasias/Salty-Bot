"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "choose",
    aliases: ["choice", "chose", "shoes"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
        },
    ],
    async action({ args, msg }) {
        if (args.length < 2) {
            return Salty_1.default.warn(msg, "You need to give at least 2 choices.");
        }
        await Salty_1.default.message(msg, `I choose ${utils_1.choice(args.join(" ").split("/"))}`);
    },
});
