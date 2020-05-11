"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
exports.default = new Command_1.default({
    name: "tts",
    keys: ["speak"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***something to say***",
            effect: "Says something out loud",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("message");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
