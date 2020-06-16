"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const config_1 = require("../../config");
const salty_1 = __importDefault(require("../../salty"));
const specialActions = [
    {
        keywords: ["nude", "nudes"],
        response: "you wish",
    },
    {
        keywords: ["nood", "noods", "noodle", "noodles"],
        response: "you're so poor",
    },
    {
        keywords: ["noot", "noots"],
        response: "NOOT NOOT",
    },
];
Command_1.default.register({
    name: "send",
    aliases: ["say", config_1.prefix],
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect: "Sends something. Who knows what?",
        },
    ],
    async action({ args, msg, target }) {
        if (!args[0]) {
            return Command_1.default.list.get("talk").run(msg, args, target);
        }
        let message;
        for (let sa of specialActions) {
            if (sa.keywords.includes(args[0])) {
                message = sa.response;
            }
        }
        if (!message) {
            msg.delete();
            message = args.join(" ");
        }
        await salty_1.default.message(msg, message);
    },
});
