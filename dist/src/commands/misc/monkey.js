"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
exports.default = new Command_1.default({
    name: "monkey",
    keys: [
        "bogosort",
        "monkeysort",
        "permutationsort",
        "shotgunsort",
        "slowsort",
        "stupidsort",
    ],
    help: [
        {
            argument: null,
            effect: "Monkey sorts a 10 elements array",
        },
        {
            argument: "***array length***",
            effect: "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we?)",
        },
    ],
    visibility: "public",
    async action({ msg, args }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("length");
        }
        if (Number(args[0]) < 1) {
            throw new Exception_1.IncorrectValue("length", "number between 1 and 10");
        }
        const runningMsg = await Salty_1.default.message(msg, "monkey sorting ...");
        let tests = 0;
        let length = Math.min(Number(args[0]), 10);
        let list = [];
        const sortingTime = await new Promise((resolve) => {
            for (let i = 0; i < length; i++) {
                list.push(i);
            }
            list = utils_1.shuffle(list);
            tests = 0;
            const startTimeStamp = Date.now();
            while (!utils_1.isSorted(list)) {
                list = utils_1.shuffle(list);
                tests++;
            }
            resolve(Math.floor((Date.now() - startTimeStamp) / 100) / 10);
        });
        runningMsg.delete();
        await Salty_1.default.success(msg, `monkey sort on a **${length}** elements list took **${sortingTime}** seconds in **${tests}** tests`, { react: "🐒" });
    },
});
