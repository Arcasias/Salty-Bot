"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const PING_MESSAGES = [
    "nearly perfect!",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag?",
    "dear god are you on a safari in the middle of the ocean?",
    "get off of this world you fucking chinese",
];
Command_1.default.register({
    name: "ping",
    aliases: ["latency", "test"],
    category: "general",
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],
    async action({ args, msg }) {
        var _a;
        if (args.length && args[0] === "role") {
            const roles = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache;
            if (roles) {
                const roleIds = roles
                    .filter((role) => Boolean(role.color))
                    .map((role) => utils_1.pingable(role.id));
                return Salty_1.default.message(msg, roleIds.join(" "));
            }
            else {
                return Salty_1.default.warn(msg, "No roles on this server.");
            }
        }
        else {
            if (utils_1.generate(3)) {
                return Salty_1.default.success(msg, "pong, and I don't give a fuck about your latency");
            }
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = PING_MESSAGES[Math.floor(latency / 100)] || "lol wat";
            await sentMsg.delete();
            await Salty_1.default.success(msg, `pong! Latency is ${latency}. ${utils_1.title(message)}`);
        }
    },
});
