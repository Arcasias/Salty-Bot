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
                "***command key 1***, ***command key 2***, ...  // ***answer 1***, ***answer 2***, ... ",
            effect:
                "Creates a new command having ***command aliases*** as its triggers. ***command effect*** will then be displayed as a response",
        },
    ],
    access: "dev",

    async action({ args, msg }) {
        switch (meaning(args[0])) {
            case "remove": {
                const alias: string = args[1];
                if (!alias) {
                    return salty.warn(
                        msg,
                        "You need to specify which command to remove."
                    );
                }
                const name = Command.aliases.get(alias);
                if (!name) {
                    return salty.warn(msg, "That command doesn't exist.");
                }
                const command = Command.list.get(name)!;
                if (command.type === "core") {
                    return salty.warn(
                        msg,
                        `That is a core command, you can't remove it`
                    );
                }
                await QuickCommand.remove({
                    name,
                });
                return salty.success(msg, `Command "**${name}**" deleted`);
            }
            case "list":
            case null: {
                const quickCommands = Command.list.filter(
                    (c) => c.type === "quick"
                );
                if (!quickCommands.size) {
                    return salty.info(msg, `No quick commands set.`);
                }
                let index = 1;
                return salty.embed(msg, {
                    title: "List of commands",
                    description: quickCommands
                        .map((cmd) => `${index++}) ${cmd.name}`)
                        .join("\n"),
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
