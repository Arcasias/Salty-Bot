import Crew from "../../classes/Crew";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";

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
    const guild = msg.guild!;
    const crew = await Crew.get(guild.id);
    const channel = salty.getTextChannel(msg.channel.id);
    const defaultChannel = crew.getDefaultChannel(guild);

    switch (meaning(args[0])) {
      case "add":
      case "set": {
        await crew.update({ defaultChannel: channel.id });
        return send.success(
          `channel **${
            channel.name
          }** has been successfuly set as default bot channel for **${
            msg.guild!.name
          }**`
        );
      }
      case "remove": {
        if (!defaultChannel) {
          return send.info("no default bot channel set");
        }
        await crew.update({ defaultChannel: null });
        return send.success("default bot channel has been successfuly removed");
      }
      default: {
        if (!defaultChannel) {
          return send.info("no default bot channel set");
        }
        if (channel.equals(defaultChannel)) {
          return send.info("This is the current default channel", {
            description: "I'll speak right here when I need to",
          });
        } else {
          return send.info(`Default bot channel`, {
            description: `<#${defaultChannel.id}>`,
          });
        }
      }
    }
  },
};

export default command;
