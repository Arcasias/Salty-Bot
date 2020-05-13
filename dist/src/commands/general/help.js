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
        this.keys = ["halp", "info", "infos", "wtf", "?"];
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
    }
}
exports.default = HelpCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsdURBQXlEO0FBQ3pELGdFQUEwRDtBQUMxRCx1Q0FBb0M7QUFFcEMseUNBQWdEO0FBSWhELE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0MsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGdEQUFnRDthQUMzRDtZQUNEO2dCQUNJLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLE1BQU0sRUFBRSwwREFBMEQ7YUFDckU7WUFDRDtnQkFDSSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLG9EQUFvRDthQUMvRDtTQUNKLENBQUM7SUFpR04sQ0FBQztJQS9GRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sT0FBTyxHQUFpQjtZQUMxQixLQUFLLEVBQUUsUUFBUTtZQUNmLE1BQU0sRUFBRSxFQUFFO1NBQ2IsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFHLGVBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sVUFBVSxHQUFlLEVBQUUsQ0FBQztRQUVsQyxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtZQUN2QixVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFB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