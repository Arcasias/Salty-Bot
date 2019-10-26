import Command from '../../classes/Command.js';
import packageJson from '../../package.json';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'help',
    keys: [
        "commands",
        "halp",
        "info",
        "infos",
        "wtf",
        "?",
    ],
    help: [
        {
            argument: null,
            effect: "Shows all of the available commands categories"
        },
        {
            argument: "***category***",
            effect: "Shows all of the available commands for a ***category***"
        },
        {
            argument: "***command***",
            effect: "Shows a detailed usage of a specific ***command***"
        }
    ],
    visibility: 'public',
    async action(msg, args) {
        const { author } = msg;
        const options = {
            color: 0xFFFFFF,
            fields: [],
        };
        const help = this.commands.help;
        const categories = Object.keys(help);
        const commands = Object.keys(this.commands.keys);

        while (["+", ">", "->", ">>", "=>"].includes(args[0])) {
            args.shift();
        }
        if (args[0]) {
            const arg = args[0].toLowerCase();

            if (categories.includes(arg)) {
                // arg === category
                options.title = `${arg} commands`;
                options.description = `these are the ${arg} commands. To get more information about a specific command, use the command \`$help command_name\``;

                help[arg].forEach(cmd => {
                    if ('public' === cmd.visibility ||
                            ('admin' === cmd.visibility && this.isAdmin(author, msg.guild)) ||
                            ('dev' === cmd.visibility && this.isDev(author)) ||
                            ('owner' === cmd.visibility && this.isOwner(author))) {
                        const alternate = cmd.keys.length ?
                            ` (*${cmd.keys.join("*, *")}*)` :
                            "";
                        options.fields.push({
                            title: `**${UTIL.title(cmd.name)}**${alternate}`,
                            description: `>> \`${this.config.prefix}help ${cmd.name}\``,
                        });
                    }
                });
            } else if (commands.includes(arg)) {
                // arg === command
                const command = this.commands.list.get(this.commands.keys[arg]);
                const category = categories.find(cat => help[cat].find(cmd => cmd.name === command.name));
                options.title = `**${command.name.toUpperCase()}**`;
                options.url = `${packageJson.homepage}/tree/master/commands/${category}/${command.name.toLowerCase()}.js`;
                if (0 < command.keys.length) {
                    options.description = `Alternative usage: ${command.keys.join(", ")}`;
                }
                if (command.example) {
                    options.footer = `Example: ${command.example}`;
                }
                if (command.deprecated) {
                    options.title = '[DEPRECATED] ' + options.title;
                    options.description += "\n*This command is deprecated and can no longer be used*";
                    options.color = 13107200;
                }
                command.help.forEach(usage => {
                    if (usage.effect)  {
                        options.fields.push({
                            title: `${this.config.prefix}${command.name} ${usage.argument || "" }`,
                            description: usage.effect,
                        });
                    }
                });
            } else {
                throw new error.IncorrectValue("second argument", "command or a category");
            }
        } else {
            options.title = "list of commands";
            options.description = "these are the commands categories. To get more information about a specific category, use the command \`$help category_name\`";
            for (let category in help) {
                options.fields.push({
                    title: `**${category}**  (${help[category].length} commands)`,
                    description: `>> \`${this.config.prefix}help ${category}\``,
                });
            }
        }
        await this.embed(msg, options);
    },
});

