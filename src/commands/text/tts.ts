import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "tts",
  aliases: ["speak"],
  help: [
    {
      argument: "`something to say`",
      effect: "Says something out loud",
    },
  ],
  async action({ args, msg, send }) {
    // Just sends the arguments as a TTS message
    if (!args[0]) {
      return send.warn("You need to tell me what to say.");
    }
    msg.delete().catch();
    await send.message(args.join(" "), { tts: true });
  },
};

export default command;
