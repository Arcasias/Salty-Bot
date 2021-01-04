import { MessageEmbed } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning, parseJSON } from "../../utils/generic";

const command: CommandDescriptor = {
  name: "embed",
  aliases: ["json", "parse"],
  help: [
    {
      argument: "***JSON data***",
      effect: "Parses the provided JSON as a Discord embed",
    },
  ],

  async action({ args, msg, send }) {
    let attempt = (parsed: any) => send.embed(parsed);

    await salty.deleteMessage(msg);

    if (meaning(args[0]) === "set") {
      args.shift();
      const lastMessages = await msg.channel.messages.fetch();
      const lastMessage = lastMessages
        .filter((m) => m.author.equals(salty.user))
        .last();
      if (!lastMessage) {
        return send.warn("No message to edit");
      }
      attempt = (parsed: any) =>
        lastMessage.edit({ embed: new MessageEmbed(parsed) });
    }

    const parsed = parseJSON(args.join(" "));
    if (!parsed || !Object.keys(parsed).length) {
      return send.warn("Invalid data.");
    }

    try {
      await attempt(parsed);
    } catch (error) {
      const { message } = error as Error;
      const [property, detail] = message.split(/\n/).pop()?.split(/:/) || [];
      if (property && detail) {
        return send.error(
          `Invalid embed property: ${property.replace(
            /embed\./,
            ""
          )} (${detail.trim()})`
        );
      } else {
        return send.error(`Uuuuuh something went wrong, check your spelling?`);
      }
    }
  },
};

export default command;
