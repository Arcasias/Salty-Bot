import Command from "../../classes/Command";
import Crew from "../../classes/Crew";
import Sailor from "../../classes/Sailor";
import Salty from "../../classes/Salty";
import salty from "../../salty";
import { debug, ellipsis } from "../../utils";

const MAXDEPTH = 3;
const TAB = "    ";

function stringify(variable: any, depth: number): string {
    if (MAXDEPTH < depth) {
        return "";
    }
    switch (Array.isArray(variable) ? "array" : typeof variable) {
        case "string":
            return `"${variable}"`;
        case "array": {
            const items: string[] = [];
            for (let item of variable) {
                items.push(stringify(item, depth + 1));
            }
            return `[${items.join(", ")}]`;
        }
        case "object": {
            const items: string[] = [];
            for (let key in variable) {
                items.push(
                    `${stringify(key, depth + 1)}: ${stringify(
                        variable[key],
                        depth + 1
                    )}`
                );
            }
            return `{\n${items.join(`,\n${TAB}`)}\n}`;
        }
        default:
            return String(variable);
    }
}

function evalInContext(code: string): any {
    const G = Crew;
    const U = Sailor;
    return eval(code);
}

Command.register({
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
            return salty.warn(msg, "No code to execute.");
        }
        const evalResult = evalInContext.call(Salty, args.join(" "));
        const result = `${args.join(
            " "
        )} = /*${typeof evalResult}*/ ${stringify(evalResult, 0)}`;
        const message = ellipsis(result, 1985);
        salty.message(msg, `\`\`\`js\n${message}\n\`\`\``);
        debug(message);
    },
});
