"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "embed",
    aliases: ["json", "parse"],
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed",
        },
    ],
    async action({ args, msg }) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        }
        catch (error) {
            return salty_1.default.warn(msg, "Given data must be formatted as a JSON string.");
        }
        if (!Object.keys(parsed).length) {
            return salty_1.default.warn(msg, "You must give me some data to parse.");
        }
        await salty_1.default.message(msg, null, { embed: new discord_js_1.MessageEmbed(parsed) });
    },
});
