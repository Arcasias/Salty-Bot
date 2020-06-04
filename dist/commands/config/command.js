"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const QuickCommand_1 = __importDefault(require("../../classes/QuickCommand"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
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
            effect: "Creates a new command having ***command keys*** as its triggers. ***command effect*** will then be displayed as a response",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        switch (utils_1.meaning(args[0])) {
            case "remove":
                const commandName = args[1];
                if (!commandName) {
                    return Salty_1.default.warn(msg, "You need to specify which command to remove.");
                }
                const command = QuickCommand_1.default.find((cmd) => cmd.keys.includes(commandName));
                if (!command) {
                    return Salty_1.default.warn(msg, "That command doesn't exist.");
                }
                await QuickCommand_1.default.remove(command.id);
                Salty_1.default.success(msg, `Command "**${command.name}**" deleted`);
                break;
            case "list":
            case null:
                if (!QuickCommand_1.default.size) {
                    return Salty_1.default.warn(msg, `No quick commands set.`);
                }
                await Salty_1.default.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand_1.default.map((cmd, i) => `${i + 1}) ${cmd.name}`).join("\n"),
                });
                break;
            default:
                const allArgs = args.join(" ").split("```");
                if (allArgs.length < 2) {
                    return Salty_1.default.warn(msg, "You need to tell me which answers will this command provide.");
                }
                const keys = allArgs
                    .shift()
                    .split(",")
                    .filter((word) => word.trim() !== "");
                const name = keys[0];
                const effect = allArgs.shift().trim();
                if (!keys[0]) {
                    return Salty_1.default.warn(msg, "You need to tell me by which aliases this command will be called.");
                }
                for (let key = 0; key < keys.length; key++) {
                    keys[key] = keys[key].trim().toLowerCase();
                    if (Command_1.default.aliases.has(keys[key])) {
                        return Salty_1.default.warn(msg, "That command already exists");
                    }
                }
                await QuickCommand_1.default.create({ name, keys, effect });
                await Salty_1.default.success(msg, `Command "**${name}**" created`);
        }
    },
});
