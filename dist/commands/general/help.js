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
        const options = {
            color: 0xffffff,
            fields: [],
        };
        if (args[0]) {
            const arg = args[0].toLowerCase();
            if (Command_1.default.categories.has(arg)) {
                const { commands, name, description, icon, } = Command_1.default.categories.get(arg);
                options.title = `${icon} ${utils_1.title(name)} commands`;
                options.description = `${description}. To get more information about a specific command, use the command \`$help command_name\``;
                for (const commandName of commands) {
                    const command = Command_1.default.list.get(commandName);
                    if ("access" in command &&
                        Salty_1.default.checkPermission(command.access, author, msg.guild)) {
                        const aliases = command.keys.length
                            ? ` (or ***${command.keys.join("***, ***")}***)`
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
                if (doc.keys.length) {
                    const keys = Array.isArray(doc.keys)
                        ? doc.keys.join("**, **")
                        : doc.keys;
                    options.description += `\nAlternative usage: **${keys}**`;
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
            options.title = "list of commands";
            options.description =
                "these are the commands categories. To get more information about a specific category, use the command `$help category_name`";
            Command_1.default.categories.forEach((category) => {
                const { name, icon } = category;
                options.fields.push({
                    name: `${icon} **${utils_1.title(name)}**  (${category.commands.length} commands)`,
                    value: `> \`${config_1.prefix}help ${category}\``,
                });
            });
        }
        await Salty_1.default.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHlDQUFnRDtBQUVoRCx1Q0FBb0M7QUFFcEMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDO0lBQ2pFLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsZ0RBQWdEO1NBQzNEO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLE1BQU0sRUFBRSwwREFBMEQ7U0FDckU7UUFDRDtZQUNJLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLE1BQU0sRUFBRSxvREFBb0Q7U0FDL0Q7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDdkIsTUFBTSxPQUFPLEdBQXNCO1lBQy9CLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbEMsSUFBSSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLE1BQU0sRUFDRixRQUFRLEVBQ1IsSUFBSSxFQUNKLFdBQVcsRUFDWCxJQUFJLEdBQ1AsR0FBRyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FB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