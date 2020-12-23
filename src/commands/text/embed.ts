import { MessageEmbed } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const JS_STANDARD_KEY = /\b(?<!")(\w+)(?!")\b\s*:/g;
const JS_TRAILING_COMA = /,([\s\n]*[\}\]])/g;

const command: CommandDescriptor = {
  name: "embed",
  aliases: ["json", "parse"],
  help: [
    {
      argument: "***JSON data***",
      effect: "Parses the provided JSON as a Discord embed",
    },
  ],

  async action({ args, msg }) {
    const raw = args
      .join(" ")
      .replace(JS_STANDARD_KEY, (_, match) => `"${match}":`)
      .replace(JS_TRAILING_COMA, (_, match) => match);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return salty.warn(
        msg,
        "Given data must be formatted as a JSON string or a JavaScript object."
      );
    }
    if (!Object.keys(parsed).length) {
      return salty.warn(msg, "You must give me some data to parse.");
    }
    const embed = new MessageEmbed(parsed);
    try {
      await salty.message(msg, "", { embed });
    } catch (error) {
      const { message } = error as Error;
      const [property, detail] = message.split(/\n/).pop()?.split(/:/) || [];
      if (property && detail) {
        return salty.error(
          msg,
          `Invalid embed property: ${property.replace(
            /embed\./,
            ""
          )} (${detail.trim()})`
        );
      } else {
        return salty.error(
          msg,
          `Uuuuuh something went wrong, check your spelling ?`
        );
      }
    }
  },
};

export default command;
