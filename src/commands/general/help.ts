import { Collection } from "discord.js";
import Command from "../../classes/Command";
import { config } from "../../database/config";
import salty from "../../salty";
import { keywords } from "../../strings";
import {
  CategoryId,
  CommandDescriptor,
  MessageActionsDescriptor,
  SaltyEmbedOptions,
} from "../../typings";
import { sort, title } from "../../utils/generic";

const GIT_SRC_PATH = ["blob", "master", "src"];

const command: CommandDescriptor = {
  name: "help",
  aliases: keywords.help.slice(1),
  help: [
    {
      argument: null,
      effect: "Shows all of the available commands categories",
    },
    {
      argument: "`category`",
      effect: "Shows all of the available commands for a `category`",
    },
    {
      argument: "`command`",
      effect: "Shows a detailed usage of a specific `command`",
    },
  ],

  async action({ args, msg, run, send }) {
    const options: SaltyEmbedOptions = {
      fields: [],
    };
    const messageActions: MessageActionsDescriptor = {
      actions: new Collection(),
    };
    if (args.length) {
      const arg = args[0].toLowerCase();
      const category = Command.categories.get(arg as CategoryId);
      if (category) {
        /**
         * Case 1: query is a category name
         */
        const { name, description, icon } = category;
        const commands = sort(
          [
            ...Command.list
              .filter((command) => command.category === arg)
              .values(),
          ],
          "name"
        );
        options.title = `${icon} ${title(name)} commands`;
        options.description = `${description}. To get more information about a specific command, refer to the "help" usage indicated below it.`;

        for (const command of commands) {
          if (!command.isRestricted(msg)) {
            const aliases = command.aliases.length
              ? ` (or ***${command.aliases.join("***, ***")}***)`
              : "";
            options.fields!.push({
              name: `**${command.name}**${aliases}`,
              value: `> \`${config.prefix}help ${command.name}\``,
            });
          }
        }
      } else if (Command.aliases.has(arg)) {
        /**
         * Case 2: query is a command name
         */
        const doc = Command.doc.get(Command.aliases.get(arg)!)!;
        const category = Command.categories.get(doc.category)!;
        const relativePath = __dirname
          .slice(process.cwd().length)
          .split(/[\\\/]/)
          .filter(Boolean) // remove path empty parts (idk why they exist)
          .slice(1, -1); // remove "dist" folder and "general" category to put command category
        options.title = `**${doc.name.toUpperCase()}**`;
        if (doc.category !== "quick") {
          options.url = [
            process.env.GITHUB_PAGE!,
            ...GIT_SRC_PATH,
            ...relativePath,
            doc.category,
            doc.name.toLowerCase() + ".ts",
          ].join("/");
        }
        options.footer = {
          text: `${category.icon} ${title(category.name)}`,
        };
        if (doc.aliases?.length) {
          const aliases: string = Array.isArray(doc.aliases)
            ? doc.aliases.join("**, **")
            : doc.aliases;
          options.description = `Alternative usage: **${aliases}**`;
        }
        if (!doc.sections.length) {
          doc.sections.push({
            argument: null,
            effect: `No help is available for this command, but you can open an issue on the following link to ask for it to be done: <${process
              .env.GITHUB_PAGE!}/issues>`,
          });
        }
        doc.sections.forEach((usage) => {
          const cmdSyntax = config.prefix + doc.name;
          let value = usage.effect;
          if (usage.example) {
            value += `\n\nExample:\n\`${cmdSyntax} ${usage.example.command}\`\n> ${usage.example.result}`;
          }
          options.fields!.push({
            name: `${cmdSyntax} ${usage.argument || ""}`,
            value,
          });
        });
      } else {
        return send.warn(
          "The second argument must be a command or a category."
        );
      }
    } else {
      /**
       * Case 3: query doesn't match => displays all categories
       */
      options.title = "list of commands";
      options.description =
        "These are the commands categories. Type the name of a category or a specific command after `$help` to have more information about it.";
      for (const {
        id,
        name,
        commands,
        icon,
      } of Command.getOrderedCategories()) {
        messageActions.actions.set(icon, {
          onAdd: (user, abort) => {
            if (user === msg.author) {
              abort();
              return run("help", [id]);
            }
          },
        });
        options.fields!.push({
          name: `${icon} **${title(name)}**  (${commands.length} commands)`,
          value: `> \`${config.prefix}help ${id}\``,
        });
      }
    }
    const helpEmbed = await send.embed(options);
    if (helpEmbed && messageActions.actions.size) {
      salty.addActions(helpEmbed, messageActions, msg.author.id);
    }
  },
};

export default command;
