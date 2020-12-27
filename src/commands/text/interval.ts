import salty from "../../salty";
import { CommandDescriptor, Dictionnary } from "../../typings";
import { meaning } from "../../utils";

const INTERVALS: Dictionnary<NodeJS.Timeout> = {};

const command: CommandDescriptor = {
  name: "interval",
  help: [
    {
      argument: "*delay* ***anything***",
      effect: "I'll tell what you want after a every **delay** seconds",
    },
  ],
  access: "dev",

  async action({ args, msg, send }) {
    const channel = msg.guild ? msg.guild.id : msg.author.id;
    if (meaning(args[0]) === "clear") {
      if (!INTERVALS[channel]) {
        return send.warn("There is no interval on this channel.");
      }
      salty.bot.clearInterval(INTERVALS[channel]);

      return send.success("Interval cleared");
    } else {
      if (!args.length) {
        return send.warn(
          "You need to specify the interval length in milliseconds."
        );
      }
      if (isNaN(Number(args[0]))) {
        return send.warn(
          "You need to specify the interval length in milliseconds."
        );
      }
      if (!args[1]) {
        return send.warn(
          "You need to tell me what to say after each interval."
        );
      }
      const delay = parseInt(args.shift()!) * 1000;

      salty.deleteMessage(msg);

      if (INTERVALS[channel]) {
        clearInterval(INTERVALS[channel]);
      }
      INTERVALS[channel] = salty.bot.setInterval(() => {
        send.message(args.join(" "));
      }, delay);
    }
  },
};

export default command;
