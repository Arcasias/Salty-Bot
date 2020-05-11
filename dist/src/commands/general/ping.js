"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const MESSAGES = [
    "nearly perfect !",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag ?",
    "dear god are you on a safari in the middle of the ocean ?",
    "get off of this world you fucking chinese",
];
exports.default = new Command_1.default({
    name: "ping",
    keys: ["latency", "test"],
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],
    visibility: "public",
    async action(msg) {
        if (utils_1.generate(3)) {
            await Salty_1.default.error(msg, "pong, and I don't give a fuck about your latency");
        }
        else {
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = MESSAGES[Math.floor(latency / 100)] || "lol wat";
            await sentMsg.delete();
            await Salty_1.default.success(msg, `pong ! Latency is ${latency}. ${utils_1.title(message)}`);
        }
    },
});
