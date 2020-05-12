"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "leave",
    keys: ["exit", "quit"],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    visibility: "admin",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.end();
            Salty_1.default.success(msg, `leaving **${msg.channel.name}**`);
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    },
});
