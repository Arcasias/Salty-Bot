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
class HelpCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "help";
        this.keys = ["info", "wtf", "?"];
        this.help = [
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
        ];
    }
    async action({ args, msg }) {
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
    }
}
exports.default = HelpCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBK0Q7QUFDL0QsdURBQXlEO0FBQ3pELGdFQUEwRDtBQUMxRCx1Q0FBb0M7QUFFcEMseUNBQWdEO0FBSWhELE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxnREFBZ0Q7YUFDM0Q7WUFDRDtnQkFDSSxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixNQUFNLEVBQUUsMERBQTBEO2FBQ3JFO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSxvREFBb0Q7YUFDL0Q7U0FDSixDQUFDO0lBaUdOLENBQUM7SUEvRkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWlCO1FBQ3JDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDdkIsTUFBTSxPQUFPLEdBQWlCO1lBQzFCLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBQ0YsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxVQUFVLEdBQWUsRUFBRSxDQUFDO1FBRWxDLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3ZCLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDaEMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcs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