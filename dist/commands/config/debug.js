"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
const MAXDEPTH = 3;
const TAB = "    ";
function stringify(variable, depth) {
    if (MAXDEPTH < depth) {
        return "";
    }
    switch (Array.isArray(variable) ? "array" : typeof variable) {
        case "string":
            return `"${variable}"`;
        case "array": {
            const items = [];
            for (let item of variable) {
                items.push(stringify(item, depth + 1));
            }
            return `[${items.join(", ")}]`;
        }
        case "object": {
            const items = [];
            for (let key in variable) {
                items.push(`${stringify(key, depth + 1)}: ${stringify(variable[key], depth + 1)}`);
            }
            return `{\n${items.join(`,\n${TAB}`)}\n}`;
        }
        default:
            return String(variable);
    }
}
function evalInContext(code) {
    const G = Guild_1.default;
    const U = User_1.default;
    return eval(code);
}
Command_1.default.register({
    name: "debug",
    category: "config",
    help: [
        {
            argument: "***JS code***",
            effect: "Executes a ***JS code*** within Salty context",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        if (!args[0]) {
            return salty_1.default.warn(msg, "No code to execute.");
        }
        const evalResult = evalInContext.call(Salty_1.default, args.join(" "));
        const result = `${args.join(" ")} = /*${typeof evalResult}*/ ${stringify(evalResult, 0)}`;
        const message = utils_1.ellipsis(result, 1985);
        salty_1.default.message(msg, `\`\`\`js\n${message}\n\`\`\``);
        utils_1.debug(message);
    },
});
