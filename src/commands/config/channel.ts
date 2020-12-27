import Crew from "../../classes/Crew";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils";

const command: CommandDescriptor = {
  name: "channel",
  aliases: ["chan"],
  help: [
    {
      argument: null,
      effect: "Shows the current default channel",
    },
    {
      argument: "set",
      effect: "Sets this channel as the default one for this server",
    },
    {
      argument: "unset",
      effect: "Unsets this server's default channel",
    },
  ],
  access: "admin",
  channel: "guild",

  async action({ args, msg, send }) {
    const crew = await Crew.get(msg.guild!.id);
    const channel = salty.getTextChannel(msg.channel.id);
    switch (meaning(args[0])) {
      case "add":
      case "set": {
        await Crew.update(crew.id, {
          defaultChannel: channel.id,
        });
        return send.success(
          `channel **${
            channel.name
          }** has been successfuly set as default bot channel for **${
            msg.guild!.name
          }**`
        );
      }
      case "remove": {
        if (!crew.defaultChannel) {
          return send.info("no default bot channel set");
        }
        await Crew.update(crew.id, { defaultChannel: null });
        return send.success("default bot channel has been successfuly removed");
      }
      default: {
        if (!crew.defaultChannel) {
          return send.info("no default bot channel set");
        }
        const { name } = salty.getTextChannel(crew.defaultChannel);
        if (channel.id === crew.defaultChannel) {
          return send.info("this is the current default channel", {
            description: "I'll speak right here when I need to",
          });
        } else {
          return send.info(`default bot channel is **${name}**`, {
            description: "this is where I'll speak when I need to",
          });
        }
      }
    }
  },
};

export default command;
