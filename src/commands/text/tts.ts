import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "tts",
  aliases: ["speak"],
  help: [
    {
      argument: "***something to say***",
      effect: "Says something out loud",
    },
  ],
  async action({ args, msg }) {
    // Just sends the arguments as a TTS message
    if (!args[0]) {
      return salty.warn(msg, "You need to tell me what to say.");
    }
    salty.deleteMessage(msg);
    await salty.message(msg, args.join(" "), { tts: true });
  },
};

export default command;
