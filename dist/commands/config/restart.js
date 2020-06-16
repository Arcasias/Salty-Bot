"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "restart",
    aliases: ["reset"],
    category: "config",
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    access: "dev",
    async action({ msg }) {
        await salty_1.default.info(msg, "Restarting ...");
        await salty_1.default.restart();
    },
});
