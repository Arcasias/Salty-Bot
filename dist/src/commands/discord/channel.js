"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../list");
exports.default = new Command_1.default({
    name: "channel",
    keys: ["chan"],
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
    visibility: "admin",
    async action({ msg, args }) {
        const guild = Guild_1.default.get(msg.guild.id);
        if (args[0] && list_1.add.includes(args[0])) {
            await Guild_1.default.update(guild.id, { default_channel: msg.channel.id });
            await Salty_1.default.success(msg, `channel **${msg.channel.name}** has been successfuly set as default bot channel for **${msg.guild.name}**`);
        }
        else if (args[0] && list_1.remove.includes(args[0])) {
            if (!guild.default_channel) {
                return Salty_1.default.message(msg, "no default bot channel set");
            }
            await Guild_1.default.update(guild.id, { default_channel: null });
            await Salty_1.default.success(msg, "default bot channel has been successfuly removed");
        }
        else {
            if (!guild.default_channel) {
                return Salty_1.default.message(msg, "no default bot channel set");
            }
            const { name } = Salty_1.default.getTextChannel(guild.default_channel);
            if (msg.channel.id === guild.default_channel) {
                await Salty_1.default.embed(msg, {
                    title: "this is the current default channel",
                    description: "I'll speak right here when I need to",
                });
            }
            else {
                await Salty_1.default.embed(msg, {
                    title: `default bot channel is **${name}**`,
                    description: "this is where I'll speak when I need to",
                });
            }
        }
    },
});
