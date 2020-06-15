"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Command_1 = __importDefault(require("./Command"));
const Model_1 = __importDefault(require("./Model"));
const Salty_1 = __importDefault(require("./Salty"));
class QuickCommand extends Model_1.default {
    static async create(...allValues) {
        const commands = await super.create(...allValues);
        for (const command of commands) {
            const cmd = command;
            for (const key of cmd.aliases) {
                Command_1.default.aliases.set(key, cmd.name);
            }
            Command_1.default.list.set(cmd.name, cmd);
        }
        return commands;
    }
    static async load() {
        const commands = await super.load();
        for (const command of commands) {
            const cmd = command;
            for (const key of cmd.aliases) {
                Command_1.default.aliases.set(key, cmd.name);
            }
            Command_1.default.list.set(cmd.name, cmd);
        }
        return commands;
    }
    static async remove(...ids) {
        const commands = await super.remove(...ids);
        for (const command of commands) {
            const cmd = command;
            for (const key of cmd.aliases) {
                Command_1.default.aliases.delete(key);
            }
            Command_1.default.list.delete(cmd.name);
        }
        return commands;
    }
    async run(msg, args) {
        return Salty_1.default.message(msg, utils_1.choice(this.answers));
    }
}
QuickCommand.fields = {
    name: "",
    aliases: [],
    answers: [],
};
QuickCommand.table = "commands";
exports.default = QuickCommand;
