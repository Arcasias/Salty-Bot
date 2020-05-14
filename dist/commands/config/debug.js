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
const TAB = "    ";
((a, b) => null)(Guild_1.default, User_1.default);
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
    return eval(code);
}
class DebugCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "debug";
        this.help = [
            {
                argument: "***JS code***",
                effect: "Executes a ***JS code*** within Salty context",
            },
        ];
        this.access = "dev";
    }
    async action({ args, msg }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("instructions");
        }
        const evalResult = evalInContext.call(Salty_1.default, args.join(" "));
        const result = `${args.join(" ")} = /*${typeof evalResult}*/ ${stringify(evalResult, 0)}`;
        const message = utils_1.ellipsis(result, 1985);
        Salty_1.default.message(msg, `\`\`\`js\n${message}\n\`\`\``);
        utils_1.debug(message);
    }
}
exports.default = DebugCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQThFO0FBQzlFLHVEQUFxRDtBQUNyRCxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx1Q0FBOEM7QUFFOUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUduQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBSyxFQUFFLGNBQUksQ0FBQyxDQUFDO0FBRTlCLFNBQVMsU0FBUyxDQUFDLFFBQWEsRUFBRSxLQUFhO0lBQzNDLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRTtRQUNsQixPQUFPLEVBQUUsQ0FBQztLQUNiO0lBQ0QsUUFBUSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sUUFBUSxFQUFFO1FBQ3pELEtBQUssUUFBUTtZQUNULE9BQU8sSUFBSSxRQUFRLEdBQUcsQ0FBQztRQUMzQixLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ1YsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1lBQzNCLEtBQUssSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFO2dCQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUM7WUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2xDO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNYLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztZQUMzQixLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FDTixHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUNiLEtBQUssR0FBRyxDQUFDLENBQ1osRUFBRSxDQUNOLENBQUM7YUFDTDtZQUNELE9BQU8sTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQzdDO1FBQ0Q7WUFDSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMvQjtBQUNMLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxJQUFZO0lBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFFRCxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSwrQ0FBK0M7YUFDMUQ7U0FDSixDQUFDO1FBQ0ssV0FBTSxHQUFrQixLQUFLLENBQUM7SUFlekMsQ0FBQztJQWJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLHNCQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEM7UUFFRCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUN2QixHQUFHLENBQ04sUUFBUSxPQUFPLFVBQVUsTUFBTSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxPQUFPLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELGFBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==