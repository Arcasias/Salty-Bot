"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "leave",
    aliases: ["exit", "quit"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        const channel = playlist.leave();
        if (!playlist.connection || !channel) {
            return salty_1.default.warn(msg, "I'm not in a voice channel.");
        }
        salty_1.default.info(msg, `Leaving **${channel.name}**.`);
    },
});
