"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
let purging = false;
async function purgeEndless(channel) {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!purging) {
        return;
    }
    if (messages.size) {
        await messages.first().delete();
        return purgeEndless(channel);
    }
}
Command_1.default.register({
    name: "purge",
    aliases: ["prune"],
    category: "text",
    help: [
        {
            argument: null,
            effect: "Deletes the last 100 messages",
        },
        {
            argument: "***amount***",
            effect: "Deletes the last ***amount*** messages",
        },
        {
            argument: "bot",
            effect: "Deletes the last 100 messages sent by a bot",
        },
        {
            argument: "endless",
            effect: "Recursively deletes every message one by one in the current channel. Use carefully.",
        },
        {
            argument: "clear",
            effect: "Used to stop the endless purge",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        switch (utils_1.meaning(args[0])) {
            case "bot":
                const messages = await msg.channel.messages.fetch();
                const messagesToDelete = messages.filter((message) => message.author.bot);
                if (msg.channel instanceof discord_js_1.DMChannel) {
                    await Promise.all(messagesToDelete.map((m) => msg.channel.delete(m.id)));
                }
                else {
                    await msg.channel.bulkDelete(messagesToDelete);
                }
                Salty_1.default.success(msg, "most recent bot messages have been deleted");
                break;
            case "clear":
                if (purging) {
                    purging = false;
                    Salty_1.default.success(msg, "purge stopped");
                }
                else {
                    Salty_1.default.error(msg, "i wasn't purging anything");
                }
                break;
            case "string":
                if (args[0] === "endless") {
                    purging = true;
                    return purgeEndless(msg.channel);
                }
            default:
                if (isNaN(Number(args[0]))) {
                    return Salty_1.default.warn(msg, "Given length must be a valid number.");
                }
                if (parseInt(args[0]) === 0) {
                    return Salty_1.default.warn(msg, "You must delete at least 1 message.");
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    if (msg.channel instanceof discord_js_1.DMChannel) {
                        const messages = await msg.channel.messages.fetch();
                        await Promise.all(messages.map((m) => msg.channel.delete(m.id)));
                    }
                    else {
                        await msg.channel.bulkDelete(toDelete, true);
                    }
                    await Salty_1.default.success(msg, `${toDelete} messages have been successfully deleted`);
                }
                catch (err) {
                    utils_1.error(err);
                }
        }
    },
});
