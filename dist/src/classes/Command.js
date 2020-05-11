"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Exception_1 = require("./Exception");
const Model_1 = __importDefault(require("./Model"));
const Salty_1 = __importDefault(require("./Salty"));
const list = __importStar(require("../data/list"));
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
    constructor() {
        super(...arguments);
        this.visibility = "public";
        this.env = null;
    }
    async run(msg, args) {
        try {
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
            return (MEANING_ACTIONS.find((w) => list[w].includes(word)) || "string");
        }
        else {
            return "noarg";
        }
    }
}
Command.fields = [
    "action",
    "help",
    "keys",
    "name",
    "visibility",
    "env",
];
exports.default = Command;
