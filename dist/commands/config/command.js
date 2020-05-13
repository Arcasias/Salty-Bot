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
        this.keys = ["cmd"];
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
    async action({ args, msg }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUcrQjtBQUMvQix1REFJaUM7QUFDakMsOEVBQXNEO0FBQ3RELGdFQUF3QztBQUV4QyxNQUFNLGNBQWUsU0FBUSxpQkFBTztJQUFwQzs7UUFDVyxTQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2pCLFNBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNJLFFBQVEsRUFDSixzRkFBc0Y7Z0JBQzFGLE1BQU0sRUFDRiw0SEFBNEg7YUFDbkk7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixLQUFLLENBQUM7SUF5RWhELENBQUM7SUF2RUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWlCO1FBQ3JDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzQixLQUFLLFFBQVE7Z0JBQ1QsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNkLE1BQU0sSUFBSSxzQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNuQztnQkFDRCxNQUFNLE9BQU8sR0FBaUIsc0JBQVksQ0FBQyxJQUFJLENBQzNDLENBQUMsR0FBaUIsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQ3hELENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDVixNQUFNLElBQUksMEJBQWMsQ0FDcEIsbUJBQW1CLEVBQ25CLDRCQUE0QixDQUMv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