import Command from "../../classes/Command";
import { EmptyObject, MissingArg, SaltyException, } from "../../classes/Exception";
import QuickCommand from "../../classes/QuickCommand";
import Salty from "../../classes/Salty";
export default new Command({
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
                    throw new MissingArg("command");
                }
                const command = QuickCommand.find((cmd) => cmd.keys.includes(commandName));
                if (!command) {
                    throw new SaltyException("NonExistingObject", "That command doesn't exist");
                }
                Salty.unsetQuickCommand(command);
                await QuickCommand.remove(command.id);
                Salty.success(msg, `Command "**${command.name}**" deleted`);
                break;
            case "list":
            case "noarg":
                if (!QuickCommand.size) {
                    throw new EmptyObject("commands");
                }
                await Salty.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand.map((cmd, i) => `${i + 1}) ${cmd.name}`).join("\n"),
                });
                break;
            default:
                const allArgs = args.join(" ").split("```");
                if (!allArgs[1]) {
                    throw new MissingArg("effect");
                }
                let keys = allArgs
                    .shift()
                    .split(",")
                    .filter((word) => word.trim() !== "");
                const name = keys[0];
                const effect = allArgs.shift().trim();
                if (!keys[0]) {
                    throw new MissingArg("keys");
                }
                for (let key = 0; key < keys.length; key++) {
                    keys[key] = keys[key].trim().toLowerCase();
                    if (Salty.commands.keys[keys[key]]) {
                        throw new SaltyException("ExistingObject", "That command already exists");
                    }
                }
                const commands = await QuickCommand.create({
                    name,
                    keys: keys.join(),
                    effect,
                });
                Salty.setQuickCommand(commands[0]);
                await Salty.success(msg, `Command "**${name}**" created`);
        }
    },
});
