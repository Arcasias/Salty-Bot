"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
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
                Salty_1.default.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            }
            catch (err) {
                Salty_1.default.error(msg, "the song isn't paused");
            }
        }
        else {
            Salty_1.default.error(msg, "there's nothing playing");
        }
    },
});
