import Crew from "../../classes/Crew";
import Sailor from "../../classes/Sailor";
import salty from "../../salty";
import { CommandDescriptor, Dictionnary } from "../../typings";
import * as utils from "../../utils/generic";
import * as log from "../../utils/log";

const MAXDEPTH = 3;
const TAB = "    ";
const CODE_QUOTES = /```(js|ts)?/g;
const RETURN_STATEMENT = /return/g;

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
          `${stringify(key, depth + 1)}: ${stringify(variable[key], depth + 1)}`
        );
      }
      return `{\n${items.join(`,\n${TAB}`)}\n}`;
    }
    default:
      return String(variable);
  }
}

function evalProxy(code: string): any {
  return eval(code);
}

const command: CommandDescriptor = {
  name: "debug",
  aliases: ["exec", "eval"],
  help: [
    {
      argument: "`JS code`",
      effect: "Executes a `JS code` within Salty context",
    },
  ],
  access: "dev",

  async action(actionContext) {
    const { args, send } = actionContext;
    if (!args[0]) {
      return send.warn("No code to execute.");
    }
    const ctx: Dictionnary<any> = Object.assign(
      {
        Sailor,
        Crew,
        salty,
        utils,
        log,
      },
      actionContext
    );
    const codeString = args.join(" ").replace(CODE_QUOTES, "");
    const hasReturn = RETURN_STATEMENT.test(codeString);
    const main = hasReturn ? codeString : `return ${codeString}`;
    const evalCode = `const ${Object.keys(ctx).map(
      (k) => `${k}=this.${k}`
    )};(async function(){${main}})();`;
    let result: any;
    try {
      result = await evalProxy.call(ctx, evalCode);
    } catch (err) {
      return send.error(`Error: ${err.message}`);
    }
    const message = utils.ellipsis(stringify(result, 0), 1985);
    log.debug(message);
    return send.message(
      `Result (\`${typeof result}\`):\`\`\`js\n${message}\n\`\`\``
    );
  },
};

export default command;
