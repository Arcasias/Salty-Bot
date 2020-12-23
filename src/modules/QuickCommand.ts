import { separator } from "../config";
import salty from "../salty";
import {
  ActionParameters,
  CategoryDescriptor,
  CommandDescriptor,
  Dictionnary,
  FieldsDescriptor,
  Module,
} from "../types";
import { choice, clean, log, meaning } from "../utils";
import Command from "./../classes/Command";
import Model from "./../classes/Model";

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
      argument:
        "***command key 1***, ***command key 2***, ...  // ***answer 1***, ***answer 2***, ... ",
      effect:
        "Creates a new command having ***command aliases*** as its triggers. ***command effect*** will then be displayed as a response",
    },
  ],
  access: "dev",

  async action({ args, msg }) {
    switch (meaning(args[0])) {
      case "remove": {
        const alias: string = args.slice(1).join("");
        if (!alias) {
          return salty.warn(
            msg,
            "You need to specify which command to remove."
          );
        }
        const name = Command.aliases.get(alias);
        if (!name) {
          return salty.warn(msg, "That command doesn't exist.");
        }
        const command = Command.list.get(name)!;
        if (command.category !== "quick") {
          return salty.warn(msg, `That is a core command, you can't remove it`);
        }
        await QuickCommand.remove({
          name,
        });
        return salty.success(msg, `Command "**${name}**" deleted`);
      }
      case "add":
      case "set": {
        args.shift();
      }
      default: {
        const allArgs = args
          .join(" ")
          .split(separator)
          .map((arg) => arg.trim());
        if (allArgs.length < 2) {
          return salty.warn(
            msg,
            "You need to tell me which answers will this command provide."
          );
        }
        const aliases: string[] = allArgs
          .shift()!
          .split(",")
          .map((word) => clean(word).replace(/\s+/g, ""))
          .filter(Boolean);
        const name = aliases.shift();
        if (!name) {
          return salty.warn(
            msg,
            "You need to tell me by which aliases this command will be called."
          );
        }
        const answers: string[] = allArgs
          .shift()!
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean);

        for (const alias of aliases) {
          if (Command.aliases.has(alias)) {
            return salty.warn(msg, "A command with that name already exists.");
          }
        }
        await QuickCommand.create({ name, aliases, answers });
        return salty.success(msg, `Command "**${name}**" created`);
      }
    }
  },
};

class QuickCommand extends Model {
  public name!: string;
  public aliases!: string[];
  public answers!: string[];

  public static readonly fields: FieldsDescriptor = {
    name: "",
    aliases: [],
    answers: [],
  };
  public static readonly table = "commands";

  /**
   * Creates a command descriptor from the quick command instance.
   */
  public toDescriptor(): CommandDescriptor {
    const stringAnswers = this.answers.map((a) => `- "${a}"`).join("\n");
    return Object.assign({}, this, {
      action: async ({ msg }: ActionParameters) => {
        await salty.message(msg, choice(this.answers));
      },
      help: [
        {
          argument: null,
          effect: `Answers with one of the following: \n${stringAnswers}`,
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
  onLoad: async () => {
    Command.registerCategory("quick", quickCommandDescriptor);
    const commands = (await QuickCommand.search({})) as QuickCommand[];
    for (const cmd of commands) {
      Command.registerCommand(cmd.toDescriptor(), "quick");
    }
    log(`QuickCommand module > ${commands.length} dynamic commands loaded.`);
  },
};

export default quickCommandModule;
