import Command from "../../classes/Command";
import { IncorrectValue } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { title } from "../../utils";

export default new Command({
    name: "help",
    keys: ["halp", "info", "infos", "wtf", "?"],
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
    visibility: "public",
    async action(msg, args) {
        const { author } = msg;
        const options = {
            color: 0xffffff,
            fields: [],
        };
        const help = Salty.commands.help;
        const categories = {};
        // map name and technical name for enhanced search
        for (let category in help) {
            categories[category] = category;
            categories[help[category].info.name] = category;
        }
        const commands = Object.keys(Salty.commands.keys);

        if (args[0]) {
            const arg = args[0].toLowerCase();

            // query is a category name
            if (arg in categories) {
                const { name, description, icon } = help[categories[arg]].info;
                // arg === category
                options.title = `${icon} ${title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;

                help[categories[arg]].commands.forEach((cmd) => {
                    if (
                        "public" === cmd.visibility ||
                        ("admin" === cmd.visibility &&
                            Salty.isAdmin(author, msg.guild)) ||
                        ("dev" === cmd.visibility && Salty.isDev(author)) ||
                        ("owner" === cmd.visibility && Salty.isOwner(author))
                    ) {
                        const alternate = cmd.keys.length
                            ? ` (or ***${cmd.keys.join("***, ***")}***)`
                            : "";
                        options.fields.push({
                            title: `**${title(cmd.name)}**${alternate}`,
                            description: `> \`${Salty.config.prefix}help ${cmd.name}\``,
                        });
                    }
                });
                // query is a command name
            } else if (commands.includes(arg)) {
                // arg === command
                const command = Salty.commands.list.get(
                    Salty.commands.keys[arg]
                );
                const category = Object.values(categories).find((cat) =>
                    help[cat].commands.find((cmd) => cmd.name === command.name)
                );
                options.title = `**${command.name.toUpperCase()}**`;
                options.url = `${
                    Salty.config.homepage
                }/tree/master/commands/${category}/${command.name.toLowerCase()}.js`;
                options.description = `> ${title(category)}`;
                if (0 < command.keys.length) {
                    options.description += `\nAlternative usage: **${command.keys.join(
                        "**, **"
                    )}**`;
                }
                if (command.example) {
                    options.footer = `Example: ${command.example}`;
                }
                if (command.deprecated) {
                    options.title = "[DEPRECATED] " + options.title;
                    options.description +=
                        "\n*This command is deprecated and can no longer be used*";
                    options.color = 13107200;
                }
                command.help.forEach((usage) => {
                    if (usage.effect) {
                        options.fields.push({
                            title: `${Salty.config.prefix}${command.name} ${
                                usage.argument || ""
                            }`,
                            description: usage.effect,
                        });
                    }
                });
            } else {
                throw new IncorrectValue(
                    "second argument",
                    "command or a category"
                );
            }
            // no query: displays all commands
        } else {
            options.title = "list of commands";
            options.description =
                "these are the commands categories. To get more information about a specific category, use the command `$help category_name`";
            for (let category in help) {
                const { name, icon } = help[category].info;
                options.fields.push({
                    title: `${icon} **${title(name)}**  (${
                        help[category].commands.length
                    } commands)`,
                    description: `> \`${Salty.config.prefix}help ${category}\``,
                });
            }
        }
        await Salty.embed(msg, options);
    },
});
