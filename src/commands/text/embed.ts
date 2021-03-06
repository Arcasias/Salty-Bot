import { MessageEmbed } from "discord.js";
import { CommandDescriptor } from "../../typings";
import { getTargetMessage } from "../../utils/command";
import { isEmpty, parseJSON } from "../../utils/generic";

const command: CommandDescriptor = {
  name: "embed",
  aliases: ["json", "parse"],
  help: [
    {
      argument: "`JSON data`",
      effect: "Parses the provided JSON as a Discord embed",
    },
  ],

  async action({ args, msg, send }) {
    const message = await getTargetMessage(args, msg.channel.id);

    const parsed = parseJSON(args.join(" "));
    if (isEmpty(parsed)) {
      return send.warn("Invalid data.");
    }

    await msg.delete().catch();

    try {
      if (message) {
        await message.edit({ embed: new MessageEmbed(parsed) }).catch();
      } else {
        await send.embed(parsed);
      }
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
