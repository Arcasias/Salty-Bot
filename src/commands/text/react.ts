import { GuildEmoji, Message } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";
import { apiCatch, clean, stringToReaction } from "../../utils";

const messageCache: WeakMap<Message, Promise<any>> = new WeakMap();

Command.register({
  name: "react",
  aliases: ["reaction"],
  category: "text",
  help: [
    {
      argument: "***emoji_name***",
      effect: "Reacts with the given emoji name.",
    },
    {
      argument: "***anything else***",
      effect:
        "Reacts with the given given letters (must not be a server emoji name).",
    },
  ],
  async action({ args, msg }) {
    if (!args.length) {
      return salty.warn(msg, "What do you want to react with?");
    }

    const lastMessages = await msg.channel.messages.fetch({ limit: 2 });

    if (lastMessages.size !== 2) {
      return salty.warn(msg, "No message to react to");
    }

    const lastMessage = lastMessages.last()!;

    // Remove command message
    salty.deleteMessage(msg);

    // Queue the application of the reactions after the previous has completed.
    const prom = messageCache.get(lastMessage) || Promise.resolve();
    messageCache.set(lastMessage, prom.then(applyReactions));

    async function applyReactions() {
      const reaction: string = args.map(clean).join(" ");
      const reacts: (string | GuildEmoji)[] = [];
      const guildEmoji = msg.guild?.emojis.cache.find(
        (emoji) => emoji.name === reaction
      );

      if (guildEmoji) {
        return salty.react(lastMessage, guildEmoji);
      }
      // Remove previous reactions
      await apiCatch(() => lastMessage.reactions.removeAll());
      await salty.react(lastMessage, ...stringToReaction(reaction));
    }
  },
});
