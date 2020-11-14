import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";
import { meaning, removeMentions } from "../../utils";

const purging: Set<TextChannel | DMChannel | NewsChannel> = new Set();

async function removeMessages(
    msg: Message,
    rawLength: string | undefined,
    filter?: (msg: Message) => boolean
): Promise<any> {
    const { channel } = msg;
    let limit = 100;
    if (typeof rawLength === "string") {
        const length = Number(rawLength);
        if (isNaN(length)) {
            return salty.warn(msg, "Given length must be a valid number.");
        }
        if (length < 1) {
            return salty.warn(msg, "You must delete at least 1 message.");
        }
        limit = Math.min(length, 100);
    }
    try {
        await msg.delete();
    } catch (err) {}
    const messages = await channel.messages.fetch({ limit: 100 });
    const filtered = filter ? messages.filter(filter) : messages;
    const toDelete = [...filtered.values()].slice(0, limit);
    if (channel instanceof DMChannel) {
        await Promise.allSettled(toDelete.map((m) => m.delete()));
    } else {
        await channel.bulkDelete(toDelete, true);
    }
}

async function purgeEndless(
    channel: TextChannel | DMChannel | NewsChannel
): Promise<void> {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!messages.size || !purging.has(channel)) {
        return;
    }
    await Promise.allSettled(messages.map((m) => m.delete()));
    return purgeEndless(channel);
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
    access: "admin",
    async action({ args, msg }) {
        const { channel } = msg;
        switch (meaning(args[0])) {
            case "clear": {
                if (!purging.has(channel)) {
                    return salty.warn(msg, "I wasn't purging anything");
                }
                purging.delete(channel);
                return salty.success(msg, "Purge stopped");
            }
            case "bot": {
                const filter = ({ author }: Message): boolean => author.bot;
                const cleanArgs = removeMentions(msg, args);
                return removeMessages(msg, cleanArgs[0], filter);
            }
            case "string": {
                if (args[0] === "endless") {
                    if (purging.has(channel)) {
                        return;
                    }
                    purging.add(channel);
                    return purgeEndless(channel);
                }
                let filter;
                if (msg.mentions.users.size) {
                    const mention = msg.mentions.users.first()!;
                    filter = ({ author }: Message) => author.equals(mention);
                }
                const cleanArgs = removeMentions(msg, args);
                return removeMessages(msg, cleanArgs[0], filter);
            }
            default: {
                return removeMessages(msg, args[0]);
            }
        }
    },
});
