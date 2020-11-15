import { DMChannel } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";

Command.register({
  name: "whisper",
  aliases: ["dm"],
  category: "text",
  help: [
    {
      argument: "***anything***",
      effect:
        "I will DM you what you said. If you whisper when in DM I will refrain to respond to you",
    },
  ],
  async action({ args, msg }) {
    if (msg.channel instanceof DMChannel) {
      return;
    }
    await salty.message(msg.author, args.join(" "));
  },
});
