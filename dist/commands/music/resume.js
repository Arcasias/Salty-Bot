"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "resume",
    aliases: ["unfreeze"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.resume();
                salty_1.default.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            }
            catch (err) {
                salty_1.default.warn(msg, "the song isn't paused");
            }
        }
        else {
            salty_1.default.warn(msg, "there's nothing playing");
        }
    },
});
