"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "join",
    category: "music",
    help: [
        {
            argument: null,
            effect: "Joins your voice channel",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        var _a;
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            return Salty_1.default.warn(msg, "I'm not in a voice channel.");
        }
        if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            return Salty_1.default.warn(msg, "You're not in a voice channel.");
        }
        playlist.join(msg.member.voice.channel);
    },
});
