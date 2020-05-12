"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    visibility: "dev",
    async action({ msg }) {
        await Salty_1.default.success(msg, "Restarting ...");
        await Salty_1.default.restart();
    },
});
