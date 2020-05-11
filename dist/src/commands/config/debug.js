"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const utils_1 = require("../../utils");
const MAXDEPTH = 3;
((a, b) => null)(Guild_1.default, User_1.default);
function getFormat(variable, depth) {
    if (depth > MAXDEPTH) {
        return;
    }
    const type = Array.isArray(variable) ? "array" : typeof variable;
    let res;
    switch (type) {
        case "string": {
            res = `"${variable}"`;
            break;
        }
        case "array": {
            const items = [];
            for (let item of variable) {
                items.push(getFormat(item, depth + 1));
            }
            res = `[${items.join(", ")}]`;
            break;
        }
        case "object": {
            const items = [];
            for (let key in variable) {
                items.push(`${getFormat(key, depth + 1)}: ${getFormat(variable[key], depth + 1)}`);
            }
            res = `{\n${items.join(",\n\t")}\n}`;
            break;
        }
        default:
            res = String(variable);
    }
    return res;
}
exports.default = new Command_1.default({
    name: "debug",
    keys: [],
    help: [
        {
            argument: "***JS code***",
            effect: "Executes a ***JS code*** within Salty context",
        },
    ],
    visibility: "dev",
    async action(msg, args) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("instructions");
        }
        const res = eval(args.join(" "));
        const message = `${args.join(" ")} = /*${typeof res}*/ ${getFormat(res, 0)}`;
        Salty_1.default.message(msg, `\`\`\`js\n${message.slice(0, 1950)}\n\`\`\``);
        utils_1.log(message);
    },
});
