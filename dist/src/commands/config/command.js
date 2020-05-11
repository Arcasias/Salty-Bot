"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const QuickCommand_1 = __importDefault(require("../../classes/QuickCommand"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "command",
    keys: ["cmd", "commands"],
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
    visibility: "dev",
    async action(msg, args) {
        switch (this.meaning(args[0])) {
            case "delete":
                const commandName = args[1];
                if (!commandName) {
                    throw new Exception_1.MissingArg("command");
                }
                const command = QuickCommand_1.default.find((cmd) => cmd.keys.includes(commandName));
                if (!command) {
                    throw new Exception_1.SaltyException("NonExistingObject", "That command doesn't exist");
                }
                Salty_1.default.unsetQuickCommand(command);
                await QuickCommand_1.default.remove(command.id);
                Salty_1.default.success(msg, `Command "**${command.name}**" deleted`);
                break;
            case "list":
            case "noarg":
                if (!QuickCommand_1.default.size) {
                    throw new Exception_1.EmptyObject("commands");
                }
                await Salty_1.default.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand_1.default.map((cmd, i) => `${i + 1}) ${cmd.name}`).join("\n"),
                });
                break;
            default:
                const allArgs = args.join(" ").split("```");
                if (!allArgs[1]) {
                    throw new Exception_1.MissingArg("effect");
                }
                let keys = allArgs
                    .shift()
                    .split(",")
                    .filter((word) => word.trim() !== "");
                const name = keys[0];
                const effect = allArgs.shift().trim();
                if (!keys[0]) {
                    throw new Exception_1.MissingArg("keys");
                }
                for (let key = 0; key < keys.length; key++) {
                    keys[key] = keys[key].trim().toLowerCase();
                    if (Salty_1.default.commands.keys[keys[key]]) {
                        throw new Exception_1.SaltyException("ExistingObject", "That command already exists");
                    }
                }
                const commands = await QuickCommand_1.default.create({
                    name,
                    keys: keys.join(),
                    effect,
                });
                Salty_1.default.setQuickCommand(commands[0]);
                await Salty_1.default.success(msg, `Command "**${name}**" created`);
        }
    },
});
