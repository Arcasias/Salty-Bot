"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "shuffle",
    aliases: ["mix"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.queue.length > 2) {
            playlist.shuffle();
            salty_1.default.success(msg, "queue shuffled!", { react: "🔀" });
        }
        else {
            salty_1.default.warn(msg, "don't you think you'd need more than 1 song to make it useful?");
        }
    },
});
