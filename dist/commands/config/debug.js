"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
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
    help: [
        {
            argument: "***JS code***",
            effect: "Executes a ***JS code*** within Salty context",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        if (!args[0]) {
            return Salty_1.default.warn(msg, "No code to execute.");
        }
        const evalResult = evalInContext.call(Salty_1.default, args.join(" "));
        const result = `${args.join(" ")} = /*${typeof evalResult}*/ ${stringify(evalResult, 0)}`;
        const message = utils_1.ellipsis(result, 1985);
        Salty_1.default.message(msg, `\`\`\`js\n${message}\n\`\`\``);
        utils_1.debug(message);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsOERBQXNDO0FBQ3RDLHVDQUE4QztBQUU5QyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbkIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDO0FBRW5CLFNBQVMsU0FBUyxDQUFDLFFBQWEsRUFBRSxLQUFhO0lBQzNDLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRTtRQUNsQixPQUFPLEVBQUUsQ0FBQztLQUNiO0lBQ0QsUUFBUSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sUUFBUSxFQUFFO1FBQ3pELEtBQUssUUFBUTtZQUNULE9BQU8sSUFBSSxRQUFRLEdBQUcsQ0FBQztRQUMzQixLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ1YsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1lBQzNCLEtBQUssSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFO2dCQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUM7WUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2xDO1FBQ0QsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUNYLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztZQUMzQixLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FDTixHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUNiLEtBQUssR0FBRyxDQUFDLENBQ1osRUFBRSxDQUNOLENBQUM7YUFDTDtZQUNELE9BQU8sTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQzdDO1FBQ0Q7WUFDSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMvQjtBQUNMLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxJQUFZO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLGVBQUssQ0FBQztJQUNoQixNQUFNLENBQUMsR0FBRyxjQUFJLENBQUM7SUFDZixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBRUQsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLCtDQUErQztTQUMxRDtLQUNKO0lBQ0QsTUFBTSxFQUFFLEtBQUs7SUFFYixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDdkIsR0FBRyxDQUNOLFFBQVEsT0FBTyxVQUFVLE1BQU0sU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELE1BQU0sT0FBTyxHQUFHLGdCQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGFBQWEsT0FBTyxVQUFVLENBQUMsQ0FBQztRQUNuRCxhQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9