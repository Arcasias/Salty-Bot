"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "channel",
    aliases: ["chan"],
    category: "config",
    help: [
        {
            argument: null,
            effect: "Shows the current default channel",
        },
        {
            argument: "set",
            effect: "Sets this channel as the default one for this server",
        },
        {
            argument: "unset",
            effect: "Unsets this server's default channel",
        },
    ],
    access: "admin",
    channel: "guild",
    async action({ args, msg }) {
        const guild = Guild_1.default.get(msg.guild.id);
        switch (utils_1.meaning(args[0])) {
            case "add":
            case "set": {
                await Guild_1.default.update(guild.id, {
                    default_channel: msg.channel.id,
                });
                return salty_1.default.success(msg, `channel **${msg.channel.name}** has been successfuly set as default bot channel for **${msg.guild.name}**`);
            }
            case "remove": {
                if (!guild.default_channel) {
                    return salty_1.default.info(msg, "no default bot channel set");
                }
                await Guild_1.default.update(guild.id, { default_channel: null });
                return salty_1.default.success(msg, "default bot channel has been successfuly removed");
            }
            default: {
                if (!guild.default_channel) {
                    return salty_1.default.info(msg, "no default bot channel set");
                }
                const { name } = salty_1.default.getTextChannel(guild.default_channel);
                if (msg.channel.id === guild.default_channel) {
                    return salty_1.default.info(msg, "this is the current default channel", { description: "I'll speak right here when I need to" });
                }
                else {
                    return salty_1.default.info(msg, `default bot channel is **${name}**`, {
                        description: "this is where I'll speak when I need to",
                    });
                }
            }
        }
    },
});
