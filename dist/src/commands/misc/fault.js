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
    name: "fault",
    keys: ["overwatch", "reason"],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],
    visibility: "public",
    async action(msg) {
        const text = (utils_1.choice(list_1.fault.start) + utils_1.choice(list_1.fault.sentence))
            .replace(/<subject>/g, utils_1.choice(list_1.fault.subject))
            .replace(/<reason>/g, utils_1.choice(list_1.fault.reason))
            .replace(/<punishment>/g, utils_1.choice(list_1.fault.punishment));
        await Salty_1.default.message(msg, text);
    },
});
