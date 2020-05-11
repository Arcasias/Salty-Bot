import Command from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { log } from "../../utils";

const MAXDEPTH = 3;

// Avoid linter to consider these useless
((a, b) => null)(Guild, User);

function getFormat(variable: any, depth: number): string {
    if (depth > MAXDEPTH) {
        return;
    }
    const type: string = Array.isArray(variable) ? "array" : typeof variable;
    let res: string;
    switch (type) {
        case "string": {
            res = `"${variable}"`;
            break;
        }
        case "array": {
            const items: string[] = [];
            for (let item of variable) {
                items.push(getFormat(item, depth + 1));
            }
            res = `[${items.join(", ")}]`;
            break;
        }
        case "object": {
            const items: string[] = [];
            for (let key in variable) {
                items.push(
                    `${getFormat(key, depth + 1)}: ${getFormat(
                        variable[key],
                        depth + 1
                    )}`
                );
            }
            res = `{\n${items.join(",\n\t")}\n}`;
            break;
        }
        default:
            res = String(variable);
    }
    return res;
}

export default new Command({
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
            throw new MissingArg("instructions");
        }

        const res = eval(args.join(" "));
        const message = `${args.join(" ")} = /*${typeof res}*/ ${getFormat(
            res,
            0
        )}`;

        Salty.message(msg, `\`\`\`js\n${message.slice(0, 1950)}\n\`\`\``);
        log(message);
    },
});
