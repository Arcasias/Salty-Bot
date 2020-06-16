"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "coffee",
    aliases: ["cof", "covfefe"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Gets you a nice hot coffee",
        },
        {
            argument: "***mention***",
            effect: "Gets the ***mention*** a nice hot coffee",
        },
    ],
    channel: "guild",
    async action({ msg, target }) {
        const options = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: {
                url: "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            },
            color: 0x523415,
        };
        if (target.isMention) {
            if (target.user.id === salty_1.default.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            }
            else {
                options.description = `Made with ♥ by **${msg.member.displayName}** for **${target.name}**`;
            }
        }
        await salty_1.default.embed(msg, options);
    },
});
