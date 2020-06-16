"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const QuickCommand_1 = __importDefault(require("../../classes/QuickCommand"));
const config_1 = require("../../config");
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "command",
    aliases: ["cmd"],
    category: "config",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***command key 1***, ***command key 2***, ...  \\`\\`\\`***command block***\\`\\`\\`",
            effect: "Creates a new command having ***command aliases*** as its triggers. ***command effect*** will then be displayed as a response",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        switch (utils_1.meaning(args[0])) {
            case "remove": {
                const commandName = args[1];
                if (!commandName) {
                    return salty_1.default.warn(msg, "You need to specify which command to remove.");
                }
                const command = QuickCommand_1.default.find((cmd) => cmd.aliases.includes(commandName));
                if (!command) {
                    return salty_1.default.warn(msg, "That command doesn't exist.");
                }
                await QuickCommand_1.default.remove(command.id);
                return salty_1.default.success(msg, `Command "**${command.name}**" deleted`);
            }
            case "list":
            case null: {
                if (!QuickCommand_1.default.size) {
                    return salty_1.default.info(msg, `No quick commands set.`);
                }
                return salty_1.default.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand_1.default.map((cmd, i) => `${i + 1}) ${cmd.name}`).join("\n"),
                });
            }
            case "add": {
                args.shift();
            }
            default: {
                const allArgs = args
                    .join(" ")
                    .split(config_1.separator)
                    .map((arg) => arg.trim());
                if (allArgs.length < 2) {
                    return salty_1.default.warn(msg, "You need to tell me which answers will this command provide.");
                }
                const aliases = allArgs
                    .shift()
                    .split(",")
                    .map((word) => utils_1.clean(word))
                    .filter(Boolean);
                const name = aliases[0];
                if (!name) {
                    return salty_1.default.warn(msg, "You need to tell me by which aliases this command will be called.");
                }
                const answers = allArgs
                    .shift()
                    .split(",")
                    .filter((word) => word.trim() !== "");
                for (const alias of aliases) {
                    if (Command_1.default.aliases.has(alias)) {
                        return salty_1.default.warn(msg, "A command with that name already exists.");
                    }
                }
                await QuickCommand_1.default.create({ name, aliases, answers });
                return salty_1.default.success(msg, `Command "**${name}**" created`);
            }
        }
    },
});
