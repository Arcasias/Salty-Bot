import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { homepage, prefix } from "../../config";
import { SaltyEmbedOptions } from "../../types";
import { title } from "../../utils";

Command.register({
    name: "help",
    keys: ["info", "information", "wtf", "?", "doc", "documentation"],
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

    async action({ args, msg }) {
        const { author } = msg;
        const options: SaltyEmbedOptions = {
            color: 0xffffff,
            fields: [],
        };
        if (args[0]) {
            const arg = args[0].toLowerCase();
            // query is a category name
            if (Command.categories.has(arg)) {
                const {
                    commands,
                    name,
                    description,
                    icon,
                } = Command.categories.get(arg)!;
                // arg === category
                options.title = `${icon} ${title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;

                for (const commandName of commands) {
                    const command = Command.list.get(commandName)!;
                    if (
                        "access" in command &&
                        Salty.checkPermission(command.access, author, msg.guild)
                    ) {
                        const aliases = command.keys.length
                            ? ` (or ***${command.keys.join("***, ***")}***)`
                            : "";
                        options.fields!.push({
                            name: `**${title(command.name)}**${aliases}`,
                            value: `> \`${prefix}help ${command.name}\``,
                        });
                    }
                }
                // query is a command name
            } else if (Command.aliases.has(arg)) {
                // arg === command
                const doc = Command.doc.get(Command.aliases.get(arg)!)!;
                const category = Command.categories.get(doc.category)!;
                options.title = `**${doc.name.toUpperCase()}**`;
                options.url = `${homepage}/tree/master/commands/${
                    doc.category
                }/${doc.name.toLowerCase()}.js`;
                options.description = `> ${title(category.name)}`;
                if (doc.keys.length) {
                    const keys: string = Array.isArray(doc.keys)
                        ? doc.keys.join("**, **")
                        : doc.keys;
                    options.description += `\nAlternative usage: **${keys}**`;
                }
                doc.sections.forEach((usage) => {
                    if (usage.effect) {
                        options.fields!.push({
                            name: `${prefix}${doc.name} ${
                                usage.argument || ""
                            }`,
                            value: usage.effect,
                        });
                    }
                });
            } else {
                return Salty.warn(
                    msg,
                    "The second argument must be a command or a category."
                );
            }
            // no query: displays all commands
        } else {
            options.title = "list of commands";
            options.description =
                "these are the commands categories. To get more information about a specific category, use the command `$help category_name`";
            Command.categories.forEach((category) => {
                const { name, icon } = category;
                options.fields!.push({
                    name: `${icon} **${title(name)}**  (${
                        category.commands.length
                    } commands)`,
                    value: `> \`${prefix}help ${category}\``,
                });
            });
        }
        await Salty.embed(msg, options);
    },
});
