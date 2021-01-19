import { DMChannel } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "whisper",
  aliases: ["dm"],
  help: [
    {
      argument: "`anything`",
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
};

export default command;
