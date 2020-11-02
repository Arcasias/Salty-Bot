import Command from "../../classes/Command";
import { homepage, prefix } from "../../config";
import salty from "../../salty";
import { Dictionnary, SaltyEmbedOptions } from "../../types";
import { title } from "../../utils";

Command.register({
    name: "help",
    aliases: ["info", "information", "wtf", "?", "doc", "documentation"],
    category: "general",
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

    async action({ args, msg, source, target }) {
        const options: SaltyEmbedOptions = {
            fields: [],
        };
        if (args.length) {
            const arg = args[0].toLowerCase();
            // query is a category name
            if (Command.categories.has(arg)) {
                const { name, description, icon } = Command.categories.get(
                    arg
                )!;
                const commands = Command.list.filter(
                    (command) =>
                        "category" in command && command.category === arg
                );
                // arg === category
                options.title = `${icon} ${title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;

                for (const command of commands.values()) {
                    if (
                        "access" in command &&
                        salty.hasAccess(command.access, msg.author, msg.guild)
                    ) {
                        const aliases = command.aliases.length
                            ? ` (or ***${command.aliases.join("***, ***")}***)`
                            : "";
                        options.fields!.push({
                            name: `> \`${prefix}help ${command.name}\``,
                            value: `**${title(command.name)}**${aliases}`,
                        });
                    }
                }
                // query is a command name
            } else if (Command.aliases.has(arg)) {
                // arg === command
                const doc = Command.doc.get(Command.aliases.get(arg)!)!;
                const category = Command.categories.get(doc.category)!;
                const relativePath = __dirname
                    .slice(process.cwd().length)
                    .split(/[\\\/]/)
                    .filter((w: string) => Boolean(w)) // remove empty strings
                    .slice(0, -1); // remove current category
                options.title = `**${doc.name.toUpperCase()}**`;
                options.url = [
                    homepage,
                    "blob/master",
                    ...relativePath,
                    doc.category,
                    doc.name.toLowerCase() + ".ts",
                ].join("/");
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
            // no query: displays all commands
        } else {
            const mapping: Dictionnary<string> = {};
            options.title = "list of commands";
            options.description =
                "These are the commands categories. Type the name of a category or a specific command after `$help` to have more information about it.";
            options.actions = {
                reactions: [],
                onAdd: ({ emoji }, user, abort) => {
                    if (user === msg.author) {
                        abort();
                        return this.action({
                            args: [mapping[emoji.name]],
                            msg,
                            source,
                            target,
                        });
                    }
                },
            };
            for (const [
                category,
                { name, icon },
            ] of Command.categories.entries()) {
                const commands = Command.list.filter(
                    (command) =>
                        "category" in command && command.category === category
                );
                mapping[icon] = category;
                options.actions.reactions.push(icon);
                options.fields!.push({
                    name: `${icon} **${title(name)}**  (${
                        commands.size
                    } commands)`,
                    value: `> \`${prefix}help ${category}\``,
                });
            }
        }
        await salty.embed(msg, options);
    },
});
