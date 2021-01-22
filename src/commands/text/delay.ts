import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "delay",
  aliases: ["sleep", "timeout"],
  help: [
    {
      argument: "*delay* `anything`",
      effect: "I'll tell what you want after a provided delay",
    },
  ],

  async action({ args, msg, send }) {
    if (!args.length) {
      return salty.warn(msg, "You must tell me what to say after the delay.");
    }
    const delay =
      args[1] && !isNaN(Number(args[0]))
        ? parseInt(args.shift()!) * 1000
        : 5000;

    msg.delete().catch();
    salty.bot.setTimeout(() => {
      send.message(args.join(" "));
    }, delay);
  },
};

export default command;
