"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const QuickCommand_1 = __importDefault(require("../../classes/QuickCommand"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class CommandCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "command";
        this.keys = ["cmd", "commands"];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "***command key 1***, ***command key 2***, ...  \\`\\`\\`***command block***\\`\\`\\`",
                effect: "Creates a new command having ***command keys*** as its triggers. ***command effect*** will then be displayed as a response",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg, args }) {
        switch (this.meaning(args[0])) {
            case "remove":
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
    }
}
exports.default = CommandCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUFrRTtBQUNsRSx1REFJaUM7QUFDakMsOEVBQXNEO0FBQ3RELGdFQUF3QztBQUV4QyxNQUFNLGNBQWUsU0FBUSxpQkFBTztJQUFwQzs7UUFDVyxTQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2pCLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUNKLHNGQUFzRjtnQkFDMUYsTUFBTSxFQUNGLDRIQUE0SDthQUNuSTtTQUNKLENBQUM7UUFDSyxlQUFVLEdBQXFCLEtBQUssQ0FBQztJQXlFaEQsQ0FBQztJQXZFRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxRQUFRO2dCQUNULE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDZCxNQUFNLElBQUksc0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbkM7Z0JBQ0QsTUFBTSxPQUFPLEdBQWlCLHNCQUFZLENBQUMsSUFBSSxDQUMzQyxDQUFDLEdBQWlCLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUN4RCxDQUFDO2dCQUNGLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ1YsTUFBTSxJQUFJLDBCQUFjLENBQ3BCLG1CQUFtQixFQUNu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