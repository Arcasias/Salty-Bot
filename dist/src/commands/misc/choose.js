"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
exports.default = new Command_1.default({
    name: "choose",
    keys: ["choice", "chose", "shoes"],
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
    visibility: "public",
    async action({ msg, args }) {
        if (!args[0] || !args[1]) {
            throw new Exception_1.MissingArg("choices");
        }
        await Salty_1.default.message(msg, `I choose ${utils_1.choice(args.join(" ").split("/"))}`);
    },
});
