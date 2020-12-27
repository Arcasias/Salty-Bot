import { waifus } from "../../strings";
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

  async action({ send }) {
    const { name, anime, image } = choice(waifus);
    await send.embed({
      title: name,
      description: `anime: ${anime}`,
      image: { url: choice(image) },
    });
  },
};

export default command;
