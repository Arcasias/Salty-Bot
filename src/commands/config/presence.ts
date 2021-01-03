import { PresenceStatusData } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor, StatusInfos } from "../../typings";
import { meaning } from "../../utils/generic";

const STATUSINFO: StatusInfos = {
  dnd: { title: "do not disturb", color: 15746887 },
  idle: { title: "idle", color: 16426522 },
  online: { title: "online", color: 4437378 },
  invisible: { title: "invisible" },
};

const command: CommandDescriptor = {
  name: "presence",
  aliases: ["activity", "status"],
  access: "dev",

  async action({ args, send }) {
    switch (meaning(args[0])) {
      case "remove":
      case "clear": {
        await salty.bot.user!.setPresence({ activity: undefined });
        return send.success("current status removed");
      }
      case "add":
      case "set": {
        args.shift();
      }
      case "string": {
        const status = args[0] as PresenceStatusData;
        if (status in STATUSINFO) {
          // status
          await salty.bot.user!.setStatus(status);
          return send.success(
            `changed my status to **${STATUSINFO[status].title}**`,
            { color: STATUSINFO[status].color }
          );
        } else {
          // game
          await salty.bot.user!.setActivity(status);
          return send.success(`changed my status to **${status}**`);
        }
      }
      default: {
        const { color, title } = STATUSINFO[
          <keyof StatusInfos>salty.bot.user!.presence.status
        ];
        const description = salty.bot.user!.presence.status;
        return send.embed({ color, title, description });
      }
    }
  },
};

export default command;
