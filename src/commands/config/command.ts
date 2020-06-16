import Command from "../../classes/Command";
import QuickCommand from "../../classes/QuickCommand";
import { separator } from "../../config";
import salty from "../../salty";
import { clean, meaning } from "../../utils";

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
                "Creates a new command having ***command aliases*** as its triggers. ***command effect*** will then be displayed as a response",
        },
    ],
    access: "dev",

    async action({ args, msg }) {
        switch (meaning(args[0])) {
            case "remove": {
                const commandName: string = args[1];
                if (!commandName) {
                    return salty.warn(
                        msg,
                        "You need to specify which command to remove."
                    );
                }
                const command = QuickCommand.find((cmd: QuickCommand) =>
                    cmd.aliases.includes(commandName)
                );
                if (!command) {
                    return salty.warn(msg, "That command doesn't exist.");
                }
                await QuickCommand.remove(command.id);
                return salty.success(
                    msg,
                    `Command "**${command.name}**" deleted`
                );
            }
            case "list":
            case null: {
                if (!QuickCommand.size) {
                    return salty.info(msg, `No quick commands set.`);
                }
                return salty.embed(msg, {
                    title: "List of commands",
                    description: QuickCommand.map(
                        (cmd: QuickCommand, i) => `${i! + 1}) ${cmd.name}`
                    ).join("\n"),
                });
            }
            case "add": {
                args.shift();
            }
            default: {
                const allArgs = args
                    .join(" ")
                    .split(separator)
                    .map((arg) => arg.trim());
                if (allArgs.length < 2) {
                    return salty.warn(
                        msg,
                        "You need to tell me which answers will this command provide."
                    );
                }
                const aliases: string[] = allArgs
                    .shift()!
                    .split(",")
                    .map((word) => clean(word))
                    .filter(Boolean);
                const name: string = aliases[0];
                if (!name) {
                    return salty.warn(
                        msg,
                        "You need to tell me by which aliases this command will be called."
                    );
                }
                const answers: string[] = allArgs
                    .shift()!
                    .split(",")
                    .filter((word) => word.trim() !== "");

                for (const alias of aliases) {
                    if (Command.aliases.has(alias)) {
                        return salty.warn(
                            msg,
                            "A command with that name already exists."
                        );
                    }
                }
                await QuickCommand.create({ name, aliases, answers });
                return salty.success(msg, `Command "**${name}**" created`);
            }
        }
    },
});
