"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
exports.default = new Command_1.default({
    name: "talk",
    keys: [],
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
    visibility: "public",
    async action({ msg, args }) {
        const cleanedMsg = " " + args.map((arg) => utils_1.clean(arg)).join(" ") + " ";
        const meanFound = [];
        const answers = [];
        for (const mean in list_1.meaning) {
            for (const term of list_1.meaning[mean].list) {
                if (!meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + term + " ", "g"))) {
                    meanFound.push(mean);
                }
            }
        }
        if (meanFound.length) {
            for (const meaningFound of meanFound) {
                for (const answerType of list_1.meaning[meaningFound].answers) {
                    answers.push(utils_1.choice(list_1.answers[answerType]));
                }
            }
            await Salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = list_1.answers.rand;
            await Salty_1.default.message(msg, utils_1.choice(random));
        }
    },
});
