import axios from "axios";
import { Message } from "discord.js";
import salty from "../salty";
import { CommandDescriptor, Module } from "../typings";
import { meaning } from "../utils/generic";

const CAT_API_URL: string = "https://api.thecatapi.com/v1/images/search";
const CAT_PREFIX: string = "🐱";

const catsCommand: CommandDescriptor = {
  name: "catify",
  aliases: ["cats"],
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
  async action({ args, msg, send }) {
    const channel = salty.getTextChannel(msg.channel.id);
    const isCatified = channel.name.startsWith(CAT_PREFIX);
    const reason = `cat channel toggled by ${msg.author.username}`;
    switch (meaning(args[0])) {
      case "add":
      case "set": {
        if (isCatified) {
          return send.warn("This is already a cat channel!");
        }
        await channel.edit(
          { name: [CAT_PREFIX, channel.name].join("") },
          reason
        );
        return send.success("Channel set as a cat channel", {
          react: CAT_PREFIX,
        });
      }
      case "remove": {
        if (!isCatified) {
          return send.warn("This channel is not a cat channel!");
        }
        await channel.edit(
          { name: channel.name.slice(CAT_PREFIX.length) },
          reason
        );
        return send.success("Channel unset as a cat channel", {
          react: CAT_PREFIX,
        });
      }
      default: {
        await send.message(
          `This channel is ${isCatified ? "" : "not "}catified`
        );
      }
    }
  },
};

const catsModule: Module = {
  commands: [{ category: "misc", command: catsCommand }],
  async onMessage(msg: Message) {
    // Only applies to "marked" channels
    if (!salty.getTextChannel(msg.channel.id).name.startsWith(CAT_PREFIX)) {
      return;
    }
    salty.deleteMessage(msg);
    const {
      data: [firstResult],
    } = await axios.get(CAT_API_URL);
    await salty.message(msg, firstResult.url, {
      format: false,
      title: false,
    });
  },
};

export default catsModule;
