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
    name: "joke",
    keys: ["fun", "haha", "jest", "joker", "jokes"],
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes !",
        },
    ],
    visibility: "public",
    async action(msg) {
        await Salty_1.default.message(msg, utils_1.choice(list_1.jokes));
    },
});
