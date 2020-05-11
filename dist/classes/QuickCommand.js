"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
class QuickCommand extends Model_1.default {
    constructor() {
        super(...arguments);
        this.keys = "";
        this.effect = "";
        this.name = "";
        this.stored = true;
    }
}
QuickCommand.table = "commands";
exports.default = QuickCommand;
