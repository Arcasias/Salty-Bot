import { Collection } from "discord.js";
import Command from "../../classes/Command";
import { homepage, prefix } from "../../config";
import salty from "../../salty";
import { help } from "../../terms";
import {
  CategoryId,
  CommandDescriptor,
  MessageActionsDescriptor,
  SaltyEmbedOptions,
} from "../../types";
import { sort, title } from "../../utils";

const GIT_SRC_PATH = ["blob", "master", "src"];

const command: CommandDescriptor = {
  name: "help",
  aliases: help,
  help: [
    {
      argument: null,
      effect: "Shows all of the available commands categories",
    },
    {
      argument: "***category***",
      effect: "Shows all of the available commands for a ***category***",
    },
    {
      argument: "***command***",
      effect: "Shows a detailed usage of a specific ***command***",
    },
  ],

  async action({ args, msg, source, targets }) {
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
          if (
            "access" in command &&
            salty.hasAccess(command.access, msg.author, msg.guild)
          ) {
            const aliases = command.aliases.length
              ? ` (or ***${command.aliases.join("***, ***")}***)`
              : "";
            options.fields!.push({
              name: `**${command.name}**${aliases}`,
              value: `> \`${prefix}help ${command.name}\``,
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
            homepage,
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
        doc.sections.forEach((usage) => {
          options.fields!.push({
            name: `${prefix}${doc.name} ${usage.argument || ""}`,
            value: usage.effect,
          });
        });
      } else {
        return salty.warn(
          msg,
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
      for (const [category, { name, icon }] of Command.categories.entries()) {
        const commands = Command.list.filter(
          (command) => "category" in command && command.category === category
        );
        messageActions.actions.set(icon, {
          onAdd: (user, abort) => {
            if (user === msg.author) {
              abort();
              return this.action({
                args: [category],
                msg,
                source,
                targets,
              });
            }
          },
        });
        options.fields!.push({
          name: `${icon} **${title(name)}**  (${commands.size} commands)`,
          value: `> \`${prefix}help ${category}\``,
        });
      }
    }
    const helpEmbed = await salty.embed(msg, options);
    if (helpEmbed && messageActions.actions.size) {
      salty.addActions(msg.author.id, helpEmbed, messageActions);
    }
  },
};

export default command;
