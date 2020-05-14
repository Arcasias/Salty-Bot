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
        return;
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
        this.visibility = "dev";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBRytCO0FBQy9CLHVEQUFxRDtBQUNyRCxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx1Q0FBOEM7QUFFOUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUduQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBSyxFQUFFLGNBQUksQ0FBQyxDQUFDO0FBRTlCLFNBQVMsU0FBUyxDQUFDLFFBQWEsRUFBRSxLQUFhO0lBQzNDLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRTtRQUNsQixPQUFPO0tBQ1Y7SUFDRCxRQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxRQUFRLEVBQUU7UUFDekQsS0FBSyxRQUFRO1lBQ1QsT0FBTyxJQUFJLFFBQVEsR0FBRyxDQUFDO1FBQzNCLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDVixNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7WUFDM0IsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7Z0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxQztZQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDbEM7UUFDRCxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1lBQzNCLEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUNOLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUN0QyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQ2IsS0FBSyxHQUFHLENBQUMsQ0FDWixFQUFFLENBQ04sQ0FBQzthQUNMO1lBQ0QsT0FBTyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDN0M7UUFDRDtZQUNJLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9CO0FBQ0wsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDL0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUVELE1BQU0sWUFBYSxTQUFRLGlCQUFPO0lBQWxDOztRQUNXLFNBQUksR0FBRyxPQUFPLENBQUM7UUFDZixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLCtDQUErQzthQUMxRDtTQUNKLENBQUM7UUFDSyxlQUFVLEdBQXFCLEtBQUssQ0FBQztJQWVoRCxDQUFDO0lBYkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4QztRQUVELE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RCxNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ3ZCLEdBQUcsQ0FDTixRQUFRLE9BQU8sVUFBVSxNQUFNLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRCxNQUFNLE9BQU8sR0FBRyxnQkFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxhQUFhLE9BQU8sVUFBVSxDQUFDLENBQUM7UUFDbkQsYUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9