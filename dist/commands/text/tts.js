"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "tts",
    aliases: ["speak"],
    category: "text",
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
    async action({ args, msg }) {
        if (!args[0]) {
            return Salty_1.default.warn(msg, "You need to tell me what to say.");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
