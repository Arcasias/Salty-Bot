import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils";

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

  async action({ args, msg }) {
    if (args.length < 2) {
      return salty.warn(msg, "You need to give at least 2 choices.");
    }
    await salty.message(msg, `I choose ${choice(args.join(" ").split("/"))}`);
  },
};

export default command;
