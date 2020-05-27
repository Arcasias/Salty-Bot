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
    keys: ["cmd"],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1Qyw4RUFBc0Q7QUFDdEQsZ0VBQXdDO0FBQ3hDLHVDQUFzQztBQUV0QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2IsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJO1NBQ2Y7UUFDRDtZQUNJLFFBQVEsRUFDSixzRkFBc0Y7WUFDMUYsTUFBTSxFQUNGLDRIQUE0SDtTQUNuSTtLQUNKO0lBQ0QsTUFBTSxFQUFFLEtBQUs7SUFFYixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUN0QixRQUFRLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixLQUFLLFFBQVE7Z0JBQ1QsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNkLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDYixHQUFHLEVBQ0gsOENBQThDLENBQ2pELENBQUM7aUJBQ0w7Z0JBQ0QsTUFBTSxPQUFPLEdBQUcsc0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFpQixFQUFFLEVBQUUsQ0FDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQ2pDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDVixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7aUJBQ3pEO2dCQUNELE1BQU0sc0JBQVksQ0FBQyxNQUFNLENB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