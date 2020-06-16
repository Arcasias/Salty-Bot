"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
const SPECIAL_CHARS = /[;,\.\?\!'"]/g;
Command_1.default.register({
    name: "talk",
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect: 'I\'ll answer to what you said. As I\'m not a really advanced AI, you may want to try simple things such as "Hello" or "How are you"',
        },
    ],
    async action({ args, msg }) {
        const cleanedMsg = args
            .map((arg) => utils_1.clean(arg).replace(SPECIAL_CHARS, ""))
            .filter((w) => Boolean(w))
            .join(" ");
        const meaningFound = new Set();
        const answers = [];
        for (const mean in terms_1.meaning) {
            for (const term of terms_1.meaning[mean].list) {
                const threshold = Math.floor(Math.log(term.length));
                if (utils_1.levenshtein(cleanedMsg, term) <= threshold) {
                    meaningFound.add(mean);
                }
            }
        }
        if (meaningFound.size) {
            for (const found of meaningFound.values()) {
                for (const answerType of terms_1.meaning[found].answers) {
                    answers.push(utils_1.choice(terms_1.answers[answerType]));
                }
            }
            await salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = terms_1.answers.rand;
            await salty_1.default.message(msg, utils_1.choice(random));
        }
    },
});
