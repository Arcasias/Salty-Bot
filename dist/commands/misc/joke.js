"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
const cache = {};
Command_1.default.register({
    name: "joke",
    aliases: ["fun", "haha", "jest", "joker", "jokes"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes!",
        },
    ],
    async action({ msg }) {
        if (!(msg.author.username in cache)) {
            cache[msg.author.username] = terms_1.jokes.slice();
        }
        const jokeIndex = utils_1.randInt(0, cache[msg.author.username].length);
        const [joke] = cache[msg.author.username].splice(jokeIndex, 1);
        if (!cache[msg.author.username].length) {
            delete cache[msg.author.username];
        }
        const answer = joke.answer ? `\n\n||${joke.answer}||` : "";
        await salty_1.default.message(msg, joke.text + answer);
    },
});
