"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const INTERVALS = {};
Command_1.default.register({
    name: "interval",
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a every **delay** seconds",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        const channel = msg.guild ? msg.guild.id : msg.author.id;
        if (args[0] && terms_1.clear.includes(args[0])) {
            if (!INTERVALS[channel]) {
                return Salty_1.default.warn(msg, "There is no interval on this channel.");
            }
            clearInterval(INTERVALS[channel]);
            Salty_1.default.success(msg, "Interval cleared");
        }
        else {
            if (!args[0]) {
                return Salty_1.default.warn(msg, "You need to specify the interval length in milliseconds.");
            }
            if (isNaN(Number(args[0]))) {
                return Salty_1.default.warn(msg, "You need to specify the interval length in milliseconds.");
            }
            if (!args[1]) {
                return Salty_1.default.warn(msg, "You need to tell me what to say after each interval.");
            }
            const delay = parseInt(args.shift()) * 1000;
            msg.delete().catch();
            if (INTERVALS[channel]) {
                clearInterval(INTERVALS[channel]);
            }
            INTERVALS[channel] = setInterval(() => {
                Salty_1.default.message(msg, args.join(" "));
            }, delay);
        }
    },
});
