"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "future",
    aliases: ["predict"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "",
        },
    ],
    async action({ msg }) {
        const pred = [];
        for (const prediction of terms_1.predictions) {
            pred.push(...new Array(utils_1.randInt(2, 4)).fill(prediction));
        }
        const shuffled = utils_1.shuffle(pred);
        const ellipsed = utils_1.ellipsis(shuffled.join(" ||||"), 1995);
        salty_1.default.message(msg, `||${ellipsed}||`);
    },
});
