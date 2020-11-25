import { TextChannel } from "discord.js";
import Crew from "../../classes/Crew";
import salty from "../../salty";
import { CommandDescriptor } from "../../types";

const command: CommandDescriptor = {
  name: "announcement",
  aliases: ["announce", "broadcast"],
  help: [
    {
      argument: "***text***",
      effect: "Announce something on all guilds supporting Salty",
    },
  ],
  access: "dev",

  async action({ args, msg }) {
    const crews: Crew[] = await Crew.search();
    let withDefault = 0;
    for (const { discord_id, default_channel } of crews) {
      if (default_channel) {
        const guild = salty.bot.guilds.cache.get(discord_id);
        if (guild) {
          const channel = guild.channels.cache.get(default_channel);
          if (channel instanceof TextChannel) {
            withDefault += 1;
            salty.message(channel, args.join(" "));
          }
        }
      }
    }
    await salty.success(
      msg,
      `Announcement sent accross ${withDefault} servers.`
    );
  },
};

export default command;
