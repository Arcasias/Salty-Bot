"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../data/list");
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
    async action(msg, args) {
        let cleanedMsg = " " + args.map((arg) => utils_1.clean(arg)).join(" ") + " ";
        let meanFound = [];
        let answers = [];
        for (let mean in list_1.meaning) {
            for (let i = 0; i < list_1.meaning[mean].list.length; i++) {
                if (!meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + list_1.meaning[mean].list[i] + " ", "g"))) {
                    meanFound.push(mean);
                }
            }
        }
        if (0 < meanFound.length) {
            for (let i = 0; i < meanFound.length; i++) {
                for (let j = 0; j < list_1.meaning[meanFound[i]].listAnswers.length; j++) {
                    answers.push(utils_1.choice(answers[list_1.meaning[meanFound[i]].answers[j]]));
                }
            }
            await Salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = answers["rand"];
            await Salty_1.default.message(msg, utils_1.choice(random));
        }
    },
});
