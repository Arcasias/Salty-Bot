import Command from "../../classes/Command";
import QuickCommand from "../../classes/QuickCommand";
import Salty from "../../classes/Salty";
import { meaning } from "../../utils";

Command.register({
    name: "command",
    aliases: ["cmd"],
    category: "config",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument:
                "***command key 1***, ***command key 2***, ...  \\`\\`\\`***command block***\\`\\`\\`",
            effect:
                "Creates a new command having ***command keys*** as its triggers. ***command effect*** will then be displayed as a response",
        },
    ],
    access: "dev",

    async action({ args, msg }) {
        switch (meaning(args[0])) {
            case "remove":
                const commandName: string = args[1];
                if (!commandName) {
                    return Salty.warn(
                        msg,
                        "You need to specify which command to remove."
                    );
                }
                const command = QuickCommand.find((cmd: QuickCommand) =>
                    cmd.keys.includes(commandName)
                );
                if (!command) {
                    return Salty.warn(msg, "That command doesn't exist.");
                }
                await QuickCommand.remove(command.id);

                Salty.success(msg, `Command "**${command.name}**" deleted`);
                break;
            case "list":
            case null:
                if (!QuickCommand.size) {
                    return Salty.warn(msg, `No quick commands set.`);
                }
                await Salty.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand.map(
                        (cmd: QuickCommand, i) => `${i! + 1}) ${cmd.name}`
                    ).join("\n"),
                });
                break;
            default:
                const allArgs = args.join(" ").split("```");

                if (allArgs.length < 2) {
                    return Salty.warn(
                        msg,
                        "You need to tell me which answers will this command provide."
                    );
                }
                const keys: string[] = allArgs
                    .shift()!
                    .split(",")
                    .filter((word) => word.trim() !== "");
                const name: string = keys[0];
                const effect: string = allArgs.shift()!.trim();

                if (!keys[0]) {
                    return Salty.warn(
                        msg,
                        "You need to tell me by which aliases this command will be called."
                    );
                }

                for (let key = 0; key < keys.length; key++) {
                    keys[key] = keys[key].trim().toLowerCase();

                    if (Command.aliases.has(keys[key])) {
                        return Salty.warn(msg, "That command already exists");
                    }
                }
                await QuickCommand.create({ name, keys, effect });
                await Salty.success(msg, `Command "**${name}**" created`);
        }
    },
});
