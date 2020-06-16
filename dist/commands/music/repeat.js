"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "repeat",
    aliases: ["loop", "rep", "replay"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Toggles repeat all/off for the queue",
        },
        {
            argument: "single",
            effect: "Repeats the current song",
        },
        {
            argument: "all",
            effect: "Repeat the whole queue",
        },
        {
            argument: "off",
            effect: "Disables repeat",
        },
    ],
    channel: "guild",
    async action({ args, msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        const single = () => {
            playlist.repeat = "single";
            salty_1.default.success(msg, "I will now repeat the current song", {
                react: "🔂",
            });
        };
        const all = () => {
            playlist.repeat = "all";
            salty_1.default.success(msg, "I will now repeat the whole queue", {
                react: "🔁",
            });
        };
        const off = () => {
            playlist.repeat = "off";
            salty_1.default.success(msg, "repeat disabled", { react: "❎" });
        };
        if (["single", "1", "one", "this"].includes(args[0])) {
            single();
        }
        else if (["all", "queue", "q"].includes(args[0])) {
            all();
        }
        else if (["off", "disable", "0"].includes(args[0])) {
            off();
        }
        else {
            if (playlist.repeat === "off") {
                all();
            }
            else {
                off();
            }
        }
    },
});
