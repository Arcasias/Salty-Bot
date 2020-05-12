"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "coffee",
    keys: ["cof", "covfefe"],
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
    visibility: "public",
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
            if (target.user.id === Salty_1.default.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            }
            else {
                options.description = `Made with ♥ by **${msg.member.displayName}** for **${target.member.displayName}**`;
            }
        }
        await Salty_1.default.embed(msg, options);
    },
});
