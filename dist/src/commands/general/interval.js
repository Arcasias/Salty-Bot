"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../data/list");
const INTERVALS = {};
exports.default = new Command_1.default({
    name: "interval",
    keys: [],
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
    visibility: "dev",
    async action(msg, args) {
        if (args[0] && list_1.clear.includes(args[0])) {
            if (!INTERVALS[msg.guild.id]) {
                throw new Exception_1.EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);
            Salty_1.default.success(msg, "Interval cleared");
        }
        else {
            if (!args[0]) {
                throw new Exception_1.MissingArg("delay");
            }
            if (isNaN(args[0])) {
                throw new Exception_1.IncorrectValue("delay", "number");
            }
            if (!args[1]) {
                throw new Exception_1.MissingArg("message");
            }
            const delay = parseInt(args.shift()) * 1000;
            msg.delete().catch();
            if (INTERVALS[msg.guild.id]) {
                clearInterval(INTERVALS[msg.guild.id]);
            }
            INTERVALS[msg.guild.id] = setInterval(() => {
                Salty_1.default.message(msg, args.join(" "));
            }, delay);
        }
    },
});
