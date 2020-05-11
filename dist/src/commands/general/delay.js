"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "delay",
    keys: ["later", "sleep"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a provided delay",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("anything");
        }
        const delay = args[1] && !isNaN(args[0]) ? parseInt(args.shift()) * 1000 : 5000;
        msg.delete().catch();
        setTimeout(() => {
            Salty_1.default.message(msg, args.join(" "));
        }, delay);
    },
});
