"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "pause",
    keys: ["freeze"],
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ],
    visibility: "public",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.pause();
                Salty_1.default.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            }
            catch (err) {
                Salty_1.default.error(msg, "the song is already paused");
            }
        }
        else {
            Salty_1.default.error(msg, "there's nothing playing");
        }
    },
});
