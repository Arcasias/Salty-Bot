"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
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
        const cleanedMsg = " " + args.map((arg) => utils_1.clean(arg)).join(" ") + " ";
        const meanFound = [];
        const answers = [];
        for (const mean in terms_1.meaning) {
            for (const term of terms_1.meaning[mean].list) {
                if (!meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + term + " ", "g"))) {
                    meanFound.push(mean);
                }
            }
        }
        if (meanFound.length) {
            for (const meaningFound of meanFound) {
                for (const answerType of terms_1.meaning[meaningFound].answers) {
                    answers.push(utils_1.choice(terms_1.answers[answerType]));
                }
            }
            await Salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = terms_1.answers.rand;
            await Salty_1.default.message(msg, utils_1.choice(random));
        }
    },
});
