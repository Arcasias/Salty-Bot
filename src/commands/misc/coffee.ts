import salty from "../../salty";
import { CommandDescriptor, SaltyEmbedOptions } from "../../typings";

const COFFEE_URL =
  "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg";

const command: CommandDescriptor = {
  name: "coffee",
  aliases: ["cof", "covfefe"],
  help: [
    {
      argument: null,
      effect: "Gets you a nice hot coffee",
    },
    {
      argument: "`mention`",
      effect: "Gets the `mention` a nice hot coffee",
    },
  ],
  channel: "guild",

  async action({ msg, send, source, targets }) {
    const query = targets[0] || source;
    const options: SaltyEmbedOptions = {
      title: "This is a nice coffee",
      image: { url: COFFEE_URL },
      color: 0x523415,
    };
    if (targets.length) {
      if (query.user.id === salty.bot.user!.id) {
        options.description = "How cute, you gave me a coffee ^-^";
      } else {
        options.description = `Made with ♥ by **${
          msg.member!.displayName
        }** for **${query.name}**`;
      }
    } else {
      options.description = "Specially made for you ;)";
    }
    await send.embed(options);
  },
};

export default command;
