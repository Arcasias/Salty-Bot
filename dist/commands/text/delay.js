"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "delay",
    aliases: ["sleep", "timeout"],
    category: "text",
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
    async action({ args, msg }) {
        if (!args.length) {
            return Salty_1.default.warn(msg, "You must tell me what to say after the delay.");
        }
        const delay = args[1] && !isNaN(Number(args[0]))
            ? parseInt(args.shift()) * 1000
            : 5000;
        msg.delete().catch();
        setTimeout(() => {
            Salty_1.default.message(msg, args.join(" "));
        }, delay);
    },
});
