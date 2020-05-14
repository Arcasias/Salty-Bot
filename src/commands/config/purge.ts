import { TextChannel } from "discord.js";
import Command, { CommandAccess, CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { error } from "../../utils";
import { IncorrectValue, SaltyException } from "../../classes/Exception";

let purging: boolean = false;

async function purgeEndless(channel: TextChannel): Promise<void> {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!purging) {
        return;
    }
    if (messages.size) {
        await messages.first()!.delete();
        return purgeEndless(channel);
    }
}

class PurgeCommand extends Command {
    public name = "purge";
    public keys = ["prune"];
    public help = [
        {
            argument: null,
            effect: "Deletes the last 100 messages",
        },
        {
            argument: "***amount***",
            effect: "Deletes the last ***amount*** messages",
        },
        {
            argument: "bot",
            effect: "Deletes the last 100 messages sent by a bot",
        },
        {
            argument: "endless",
            effect:
                "Recursively deletes every message one by one in the current channel. Use carefully.",
        },
        {
            argument: "clear",
            effect: "Used to stop the endless purge",
        },
    ];
    public access: CommandAccess = "dev";

    async action({ args, msg }: CommandParams) {
        switch (this.meaning(args[0])) {
            case "bot":
                const messages = await msg.channel.messages.fetch();
                let messagesToDelete = messages.filter(
                    (message) => message.author.bot
                );
                try {
                    await (<TextChannel>msg.channel).bulkDelete(
                        messagesToDelete
                    );
                    await Salty.success(
                        msg,
                        "most recent bot messages have been deleted"
                    );
                } catch (err) {
                    error(err);
                }
                break;
            case "clear":
                if (purging) {
                    purging = false;
                    Salty.success(msg, "purge stopped");
                } else {
                    Salty.error(msg, "i wasn't purging anything");
                }
                break;
            case "string":
                if (args[0] === "endless") {
                    purging = true;
                    return purgeEndless(<TextChannel>msg.channel);
                }
            /* falls through */
            default:
                if (isNaN(Number(args[0]))) {
                    throw new IncorrectValue("length", "number");
                }
                if (parseInt(args[0]) === 0) {
                    throw new SaltyException(
                        "you must delete at least 1 message"
                    );
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    await (<TextChannel>msg.channel).bulkDelete(toDelete, true);
                    await Salty.success(
                        msg,
                        `${toDelete} messages have been successfully deleted`
                    );
                } catch (err) {
                    error(err);
                }
        }
    }
}

export default PurgeCommand;
