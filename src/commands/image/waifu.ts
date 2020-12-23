import salty from "../../salty";
import { waifus } from "../../terms";
import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils";

const command: CommandDescriptor = {
  name: "waifu",
  aliases: ["waifus"],
  help: [
    {
      argument: null,
      effect: "Gets you a proper waifu. It's about time",
    },
  ],

  async action({ msg }) {
    const { name, anime, image } = choice(waifus);
    await salty.embed(msg, {
      title: name,
      description: `anime: ${anime}`,
      image: { url: choice(image) },
    });
  },
};

export default command;
