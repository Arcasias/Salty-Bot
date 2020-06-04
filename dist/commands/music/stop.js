"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "stop",
    category: "music",
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    access: "admin",
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.stop();
            Salty_1.default.success(msg, utils_1.choice(terms_1.answers.bye), {
                react: "⏹",
            });
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    },
});
