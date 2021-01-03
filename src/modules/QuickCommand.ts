import fields from "../database/fields";
import salty from "../salty";
import {
  ActionContext,
  CategoryDescriptor,
  CommandDescriptor,
  Dictionnary,
  Module,
} from "../typings";
import { choice, clean, meaning } from "../utils/generic";
import { log } from "../utils/log";
import Command from "./../classes/Command";
import Model from "./../classes/Model";

const PRIMARY_SEPARATOR: string = ";";
const SECONDARY_SEPARATOR: string = ",";
const quickCommandDescriptor: CategoryDescriptor = {
  name: "quick",
  description:
    "Configurable quick commands. See `$command` for more information.",
  icon: "📨",
  order: 10,
};

const quickCommandCommand: CommandDescriptor = {
  name: "command",
  aliases: ["cmd"],
  help: [
    {
      argument: `***alias 1***${SECONDARY_SEPARATOR} ***alias 2***${SECONDARY_SEPARATOR} ...  ${PRIMARY_SEPARATOR} ***answer 1***${SECONDARY_SEPARATOR} ***answer 2***${SECONDARY_SEPARATOR} ... `,
      effect:
        "Creates commands named with given `aliases` which will all reply with a random `answer`",
    },
  ],
  access: "dev",

  async action({ args, send }) {
    switch (meaning(args[0])) {
      case "remove": {
        const alias: string = args.slice(1).join("");
        if (!alias) {
          return send.warn("You need to specify which command to remove.");
        }
        const name = Command.aliases.get(alias);
        if (!name) {
          return send.warn("That command doesn't exist.");
        }
        const command = Command.list.get(name)!;
        if (command.category !== "quick") {
          return send.warn(`That is a core command, you can't remove it`);
        }
        await QuickCommand.remove({
          name,
        });
        return send.success(`Command "**${name}**" deleted`);
      }
      case "add":
      case "set": {
        args.shift();
      }
      default: {
        const allArgs = args
          .join(" ")
          .split(PRIMARY_SEPARATOR)
          .map((arg) => arg.trim());
        if (allArgs.length < 2) {
          return send.warn(
            "You need to tell me which answers will this command provide."
          );
        }
        const aliases: string[] = allArgs
          .shift()!
          .split(SECONDARY_SEPARATOR)
          .map((word) => clean(word).replace(/\s+/g, ""))
          .filter(Boolean);
        const name = aliases.shift();
        if (!name) {
          return send.warn(
            "You need to tell me by which aliases this command will be called."
          );
        }
        const answers: string[] = allArgs
          .shift()!
          .split(SECONDARY_SEPARATOR)
          .map((word) => word.trim())
          .filter(Boolean);

        for (const alias of aliases) {
          if (Command.aliases.has(alias)) {
            return send.warn("A command with that name already exists.");
          }
        }
        await QuickCommand.create({ name, aliases, answers });
        return send.success(`Command "**${name}**" created`);
      }
    }
  },
};

class QuickCommand extends Model {
  public name!: string;
  public aliases!: string[];
  public answers!: string[];

  public static readonly table = QuickCommand.createTable("commands", [
    fields.varchar("name", { length: 255 }),
    fields.varchar("aliases", { length: 1000, defaultValue: [] }),
    fields.varchar("answers", { length: 2000, defaultValue: [] }),
  ]);

  /**
   * Creates a command descriptor from the quick command instance.
   */
  public toDescriptor(): CommandDescriptor {
    const stringAnswers = this.answers.map((a) => `- "${a}"`).join("\n");
    return Object.assign({}, this, {
      action: async ({ msg }: ActionContext) => {
        await salty.message(msg, choice(this.answers));
      },
      help: [
        {
          argument: null,
          effect: "Try it and see what happens!",
        },
      ],
    });
  }

  /**
   * @override
   */
  public static async create<T extends Model>(...allValues: any[]) {
    const commands = await super.create(...allValues);
    for (const cmd of commands as QuickCommand[]) {
      Command.registerCommand(cmd.toDescriptor(), "quick");
    }
    return commands as T[];
  }

  /**
   * @override
   */
  public static async remove<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any>
  ) {
    const commands = await super.remove(idsOrWhere);
    for (const cmd of commands as QuickCommand[]) {
      Command.removeCommand(cmd.toDescriptor());
    }
    return commands as T[];
  }
}

const quickCommandModule: Module = {
  commands: [{ category: "config", command: quickCommandCommand }],
  async onLoad() {
    Command.registerCategory("quick", quickCommandDescriptor);
    const commands = (await QuickCommand.search({})) as QuickCommand[];
    for (const cmd of commands) {
      Command.registerCommand(cmd.toDescriptor(), "quick");
    }
    log(`${commands.length} dynamic commands loaded.`);
  },
};

export default quickCommandModule;
