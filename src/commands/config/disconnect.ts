import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "disconnect",
  aliases: ["destroy"],
  help: [
    {
      argument: null,
      effect:
        "Disconnects me and terminates my program. Think wisely before using this one, ok?",
    },
  ],
  access: "dev",

  async action({ msg }) {
    await salty.react(msg, "👋").catch();
    await salty.destroy();
  },
};

export default command;
