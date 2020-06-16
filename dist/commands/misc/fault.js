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
    name: "fault",
    aliases: ["overwatch", "reason"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],
    async action({ msg }) {
        const text = (utils_1.choice(terms_1.fault.start) + utils_1.choice(terms_1.fault.sentence))
            .replace(/<subject>/g, utils_1.choice(terms_1.fault.subject))
            .replace(/<reason>/g, utils_1.choice(terms_1.fault.reason))
            .replace(/<punishment>/g, utils_1.choice(terms_1.fault.punishment));
        await salty_1.default.message(msg, text);
    },
});
