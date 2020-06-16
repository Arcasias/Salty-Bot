"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "skip",
    aliases: ["next"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.skip();
            salty_1.default.success(msg, `skipped **${playlist.playing.title}**, but it was trash anyway`, { react: "⏩" });
        }
        else {
            salty_1.default.warn(msg, "I'm not connected to a voice channel");
        }
    },
});
