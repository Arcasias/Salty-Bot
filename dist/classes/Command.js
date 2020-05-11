"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Exception_1 = require("./Exception");
const Model_1 = __importDefault(require("./Model"));
const Salty_1 = __importDefault(require("./Salty"));
const permissions = {
    public: null,
    admin: Salty_1.default.isAdmin,
    dev: Salty_1.default.isDev,
    owner: Salty_1.default.isOwner,
};
const MEANING_ACTIONS = [
    "add",
    "delete",
    "clear",
    "list",
    "bot",
    "buy",
    "sell",
];
class Command extends Model_1.default {
    /**
     * Runs the command action
     */
    async run(msg, args) {
        try {
            if (this.deprecated) {
                throw new Exception_1.DeprecatedCommand(this.name);
            }
            if (this.visibility !== "public" &&
                !permissions[this.visibility].call(Salty_1.default, msg.author, msg.guild)) {
                throw new Exception_1.PermissionDenied(this.visibility);
            }
            if (this.env && this.env !== process.env.MODE) {
                utils_1.debug(this.name, this.env);
                throw new Exception_1.SaltyException("WrongEnvironment", "it looks like I'm not in the right environment to do that");
            }
            await this.action(msg, args);
        }
        catch (err) {
            if (err instanceof Exception_1.SaltyException) {
                return Salty_1.default.error(msg, err.message);
            }
            else {
                utils_1.error(err.stack);
            }
        }
    }
    meaning(word) {
        if (word && word.length) {
            return (MEANING_ACTIONS.find((w) => Salty_1.default.getList(w).includes(word)) ||
                "string");
        }
        else {
            return "noarg";
        }
    }
}
exports.default = Command;
