import Command from "../../classes/Command";
import salty from "../../salty";

/**
 * Deprecation purpose.
 */

Command.register({
  name: "music",
  aliases: ["play", "pause", "queue"],
  category: "general",
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
});
