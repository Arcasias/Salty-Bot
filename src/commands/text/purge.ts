import { DMChannel, NewsChannel, TextChannel } from "discord.js";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { error, meaning } from "../../utils";

let purging: boolean = false;

async function purgeEndless(
    channel: TextChannel | DMChannel | NewsChannel
): Promise<void> {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!purging) {
        return;
    }
    if (messages.size) {
        await messages.first()!.delete();
        return purgeEndless(channel);
    }
}

Command.register({
    name: "purge",
    aliases: ["prune"],
    category: "text",
    help: [
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
    ],
    access: "dev",

    async action({ args, msg }) {
        switch (meaning(args[0])) {
            case "bot":
                const messages = await msg.channel.messages.fetch();
                const messagesToDelete = messages.filter(
                    (message) => message.author.bot
                );
                if (msg.channel instanceof DMChannel) {
                    await Promise.all<any>(
                        messagesToDelete.map((m) => msg.channel.delete(m.id))
                    );
                } else {
                    await msg.channel.bulkDelete(messagesToDelete);
                }
                Salty.success(
                    msg,
                    "most recent bot messages have been deleted"
                );
                break;
            case "clear":
                if (purging) {
                    purging = false;
                    Salty.success(msg, "purge stopped");
                } else {
                    Salty.warn(msg, "I wasn't purging anything");
                }
                break;
            case "string":
                if (args[0] === "endless") {
                    purging = true;
                    return purgeEndless(msg.channel);
                }
            /* falls through */
            default:
                if (isNaN(Number(args[0]))) {
                    return Salty.warn(
                        msg,
                        "Given length must be a valid number."
                    );
                }
                if (parseInt(args[0]) === 0) {
                    return Salty.warn(
                        msg,
                        "You must delete at least 1 message."
                    );
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    if (msg.channel instanceof DMChannel) {
                        const messages = await msg.channel.messages.fetch();
                        await Promise.all<any>(
                            messages.map((m) => msg.channel.delete(m.id))
                        );
                    } else {
                        await msg.channel.bulkDelete(toDelete, true);
                    }
                    await Salty.success(
                        msg,
                        `${toDelete} messages have been successfully deleted`
                    );
                } catch (err) {
                    error(err);
                }
        }
    },
});
