"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Model_1 = __importDefault(require("./Model"));
const Salty_1 = __importDefault(require("./Salty"));
class QuickCommand extends Model_1.default {
    async run(msg, args) {
        return Salty_1.default.message(msg, utils_1.choice(this.answers));
    }
}
QuickCommand.fields = {
    answers: [],
    aliases: [],
    name: "",
};
QuickCommand.table = "commands";
exports.default = QuickCommand;
