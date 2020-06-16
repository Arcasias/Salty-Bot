"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "pause",
    aliases: ["freeze"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.pause();
                salty_1.default.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            }
            catch (err) {
                salty_1.default.warn(msg, "the song is already paused");
            }
        }
        else {
            salty_1.default.warn(msg, "there's nothing playing");
        }
    },
});
