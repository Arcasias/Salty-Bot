'use strict';

const Command = require('../../classes/Command');
const packageJson = require('../../package.json');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'help',
    keys: [
        "help",
        "halp",
        "wtf",
        "commands",
        "infos",
        "info",
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
    action: async function (msg, args) {
        var { author } = msg;
        let options = {
            color: 0xFFFFFF,
            fields: [],
        };
        let help = S.commands.help;
        let categories = Object.keys(help);
        let commands = Object.keys(S.commands.keys);

        while (["+", ">", "->", ">>", "=>"].includes(args[0])) {
            args.shift();
        }
        if (args[0]) {
            let arg = args[0].toLowerCase();

            if (categories.includes(arg)) {
                let category = arg;
                let desc = [];

                options.title = `${category} commands`;

                help[category].forEach(cmd => {
                    if ('public' === cmd.visibility ||
                            ('admin' === cmd.visibility && S.isAdmin(author, msg.guild)) ||
                            ('dev' === cmd.visibility && S.isDev(author)) ||
                            ('owner' === cmd.visibility && S.isOwner(author))) {
                        desc.push(cmd.name);
                    }
                });
                options.description = desc.join("\n");
            } else if (commands.includes(arg)) {
                let command = S.commands.list.get(S.commands.keys[arg]);
                let keys = command.keys.filter(key => command.name != key);
                let category = categories.find(cat => help[cat].find(cmd => cmd.name === command.name));

                options.title = `**${command.name.toUpperCase()}**`;
                options.url = `${packageJson.homepage}/tree/master/commands/${category}/${command.name.toLowerCase()}.js`;
                if (0 < keys.length) {
                    options.description = `Alternative usage: ${ keys.join(", ") }`;
                }
                if (command.example) {
                    options.footer = `Example: ${command.example}`;
                }
                command.help.forEach(usage => {
                    if (usage.effect)  {
                        options.fields.push({ title: `${ S.config.prefix }${ command.name }${ usage.argument ? " " + usage.argument: "" }`, description: usage.effect });
                    }
                });
            } else {
                throw new error.IncorrectValue("second argument", "command or a category");
            }
        } else {
            let description = [];

            Object.keys(help).forEach(category => {

                options.fields.push({ title: `${ category }`, description: `>> \`${ S.config.prefix }help ${ category }\`` });
            });

            options.title = "list of commands";
            options.description = "these are the commands categories. To access a specific category's commands, use the command \`$help category_name\`";
        }
        await S.embed(msg, options);
    },
});

