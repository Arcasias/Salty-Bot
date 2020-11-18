import axios from "axios";
import { Message } from "discord.js";
import Command from "../classes/Command";
import Salty from "../classes/Salty";
import salty from "../salty";
import { meaning } from "../utils";

const CAT_API_URL: string = "https://api.thecatapi.com/v1/images/search";
const CAT_PREFIX: string = "🐱";

Salty.extend(
  (S: typeof Salty) =>
    class CatsModule extends S {
      /**
       * @override
       */
      protected async onMessage(msg: Message): Promise<any> {
        // Only applies to "marked" channels
        if (!this.getTextChannel(msg.channel.id).name.startsWith(CAT_PREFIX)) {
          return super.onMessage(msg);
        }

        this.deleteMessage(msg);

        const {
          data: [firstResult],
        } = await axios.get(CAT_API_URL);
        await this.message(msg, firstResult.url, {
          format: false,
          title: false,
        });
      }
    }
);

Command.register({
  name: "catify",
  aliases: ["cats"],
  category: "misc",
  access: "admin",
  help: [
    {
      argument: "***set***",
      effect: "Sets the current channel as a cat channel",
    },
    {
      argument: "***unset***",
      effect: "Unsets the current channel as a cat channel",
    },
  ],
  async action({ args, msg }) {
    const channel = salty.getTextChannel(msg.channel.id);
    const isCatified = channel.name.startsWith(CAT_PREFIX);
    const reason = `cat channel toggled by ${msg.author.username}`;
    switch (meaning(args[0])) {
      case "add":
      case "set": {
        if (isCatified) {
          return salty.warn(msg, "This is already a cat channel!");
        }
        await channel.edit(
          { name: [CAT_PREFIX, channel.name].join("") },
          reason
        );
        return salty.success(msg, "Channel set as a cat channel", {
          react: CAT_PREFIX,
        });
      }
      case "remove": {
        if (!isCatified) {
          return salty.warn(msg, "This channel is not a cat channel!");
        }
        await channel.edit(
          { name: channel.name.slice(CAT_PREFIX.length) },
          reason
        );
        return salty.success(msg, "Channel unset as a cat channel", {
          react: CAT_PREFIX,
        });
      }
      default: {
        await salty.message(
          msg,
          `This channel is${isCatified ? "" : " not"}catified`
        );
      }
    }
  },
});
