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
    name: "disconnect",
    aliases: ["destroy"],
    category: "config",
    help: [
        {
            argument: null,
            effect: "Disconnects me and terminates my program. Think wisely before using this one, ok?",
        },
    ],
    access: "dev",
    async action({ msg }) {
        await Salty_1.default.success(msg, `${utils_1.choice(terms_1.answers.bye)} ♥`);
        await Salty_1.default.destroy();
    },
});
