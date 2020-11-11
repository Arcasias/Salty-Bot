import { GuildEmoji } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";
import { clean, stringToReaction } from "../../utils";

Command.register({
    name: "react",
    category: "text",
    async action({ args, msg }) {
        if (!args.length) {
            return salty.warn(msg, "What do you want to react with?");
        }

        const lastMessages = await msg.channel.messages.fetch({ limit: 2 });

        if (lastMessages.size !== 2) {
            return salty.warn(msg, "No message to react to");
        }

        const lastMessage = lastMessages.last()!;

        msg.delete().catch();

        const reaction: string = args.map(clean).join(" ");
        const reacts: (string | GuildEmoji)[] = [];
        const guildEmoji = msg.guild?.emojis.cache.find(
            (emoji) => emoji.name === reaction
        );

        if (guildEmoji) {
            reacts.push(guildEmoji);
        } else {
            reacts.push(...stringToReaction(reaction));
        }

        for (const react of reacts) {
            try {
                await lastMessage.react(react);
            } catch (err) {
                break;
            }
        }
    },
});
