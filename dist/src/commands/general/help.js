"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const config_1 = require("../../config");
exports.default = new Command_1.default({
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
    async action({ msg, args }) {
        const { author } = msg;
        const options = {
            color: 0xffffff,
            fields: [],
        };
        const help = Salty_1.default.commands.help;
        const categories = {};
        for (let category in help) {
            categories[category] = category;
            categories[help[category].info.name] = category;
        }
        const commands = Object.keys(Salty_1.default.commands.keys);
        if (args[0]) {
            const arg = args[0].toLowerCase();
            if (arg in categories) {
                const { name, description, icon } = help[categories[arg]].info;
                options.title = `${icon} ${utils_1.title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;
                help[categories[arg]].commands.forEach((cmd) => {
                    if ("public" === cmd.visibility ||
                        ("admin" === cmd.visibility &&
                            Salty_1.default.isAdmin(author, msg.guild)) ||
                        ("dev" === cmd.visibility && Salty_1.default.isDev(author)) ||
                        ("owner" === cmd.visibility && Salty_1.default.isOwner(author))) {
                        const alternate = cmd.keys.length
                            ? ` (or ***${cmd.keys.join("***, ***")}***)`
                            : "";
                        options.fields.push({
                            name: `**${utils_1.title(cmd.name)}**${alternate}`,
                            value: `> \`${config_1.prefix}help ${cmd.name}\``,
                        });
                    }
                });
            }
            else if (commands.includes(arg)) {
                const command = Salty_1.default.commands.list.get(Salty_1.default.commands.keys[arg]);
                const category = Object.values(categories).find((cat) => help[cat].commands.find((cmd) => cmd.name === command.name));
                options.title = `**${command.name.toUpperCase()}**`;
                options.url = `${config_1.homepage}/tree/master/commands/${category}/${command.name.toLowerCase()}.js`;
                options.description = `> ${utils_1.title(category)}`;
                if (command.keys.length) {
                    const keys = Array.isArray(command.keys)
                        ? command.keys.join("**, **")
                        : command.keys;
                    options.description += `\nAlternative usage: **${keys}**`;
                }
                if (command instanceof Command_1.default) {
                    command.help.forEach((usage) => {
                        if (usage.effect) {
                            options.fields.push({
                                name: `${config_1.prefix}${command.name} ${usage.argument || ""}`,
                                value: usage.effect,
                            });
                        }
                    });
                }
            }
            else {
                throw new Exception_1.IncorrectValue("second argument", "command or a category");
            }
        }
        else {
            options.title = "list of commands";
            options.description =
                "these are the commands categories. To get more information about a specific category, use the command `$help category_name`";
            for (let category in help) {
                const { name, icon } = help[category].info;
                options.fields.push({
                    name: `${icon} **${utils_1.title(name)}**  (${help[category].commands.length} commands)`,
                    value: `> \`${config_1.prefix}help ${category}\``,
                });
            }
        }
        await Salty_1.default.embed(msg, options);
    },
});
