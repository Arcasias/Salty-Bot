"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const config_1 = require("../../config");
const utils_1 = require("../../utils");
Command_1.default.register({
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
    async action({ args, msg, target }) {
        const options = {
            color: 0xffffff,
            fields: [],
        };
        if (args.length) {
            const arg = args[0].toLowerCase();
            if (Command_1.default.categories.has(arg)) {
                const { name, description, icon } = Command_1.default.categories.get(arg);
                const commands = Command_1.default.list.filter((command) => "category" in command && command.category === arg);
                options.title = `${icon} ${utils_1.title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;
                for (const command of commands.values()) {
                    if ("access" in command &&
                        Salty_1.default.hasAccess(command.access, msg.author, msg.guild)) {
                        const aliases = command.aliases.length
                            ? ` (or ***${command.aliases.join("***, ***")}***)`
                            : "";
                        options.fields.push({
                            name: `**${utils_1.title(command.name)}**${aliases}`,
                            value: `> \`${config_1.prefix}help ${command.name}\``,
                        });
                    }
                }
            }
            else if (Command_1.default.aliases.has(arg)) {
                const doc = Command_1.default.doc.get(Command_1.default.aliases.get(arg));
                const category = Command_1.default.categories.get(doc.category);
                options.title = `**${doc.name.toUpperCase()}**`;
                options.url = `${config_1.homepage}/tree/master/commands/${doc.category}/${doc.name.toLowerCase()}.js`;
                options.description = `> ${utils_1.title(category.name)}`;
                if (doc.aliases.length) {
                    const aliases = Array.isArray(doc.aliases)
                        ? doc.aliases.join("**, **")
                        : doc.aliases;
                    options.description += `\nAlternative usage: **${aliases}**`;
                }
                doc.sections.forEach((usage) => {
                    if (usage.effect) {
                        options.fields.push({
                            name: `${config_1.prefix}${doc.name} ${usage.argument || ""}`,
                            value: usage.effect,
                        });
                    }
                });
            }
            else {
                return Salty_1.default.warn(msg, "The second argument must be a command or a category.");
            }
        }
        else {
            const mapping = {};
            options.title = "list of commands";
            options.description =
                "these are the commands categories. To get more information about a specific category, use the command `$help category_name`";
            options.actions = {
                reactions: [],
                onAdd: ({ emoji }, user, abort) => {
                    if (user === msg.author) {
                        abort();
                        return this.action({
                            args: [mapping[emoji.name]],
                            msg,
                            target,
                        });
                    }
                },
            };
            for (const [category, { name, icon },] of Command_1.default.categories.entries()) {
                const commands = Command_1.default.list.filter((command) => "category" in command && command.category === category);
                mapping[icon] = category;
                options.actions.reactions.push(icon);
                options.fields.push({
                    name: `${icon} **${utils_1.title(name)}**  (${commands.size} commands)`,
                    value: `> \`${config_1.prefix}help ${category}\``,
                });
            }
        }
        await Salty_1.default.embed(msg, options);
    },
});
