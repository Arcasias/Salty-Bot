import salty from "../../salty";
import { CommandDescriptor } from "../../types";

/**
 * Deprecation purpose.
 */

const command: CommandDescriptor = {
  name: "music",
  aliases: ["play", "pause", "queue", "join", "leave"],
  help: [
    {
      argument: null,
      effect: "DEPRECATED: these commands are not available anymore",
    },
  ],
  async action({ msg }) {
    salty.message(
      msg,
      "Unfortunately I do not provide musical features anymore. I suggest adding a specialised bot to your server like the popular Rythm or Groovy!"
    );
  },
};

export default command;
