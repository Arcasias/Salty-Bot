import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils/generic";

const command: CommandDescriptor = {
  name: "choose",
  aliases: ["choice", "8ball"],
  help: [
    {
      argument: "***first choice*** / ***second choice*** / ...",
      effect:
        "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
    },
  ],

  async action({ args, send }) {
    if (args.length < 2) {
      return send.warn("You need to give at least 2 choices.");
    }
    await send.message(`I choose ${choice(args.join(" ").split("/"))}`);
  },
};

export default command;
