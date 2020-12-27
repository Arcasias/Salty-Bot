import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "restart",
  aliases: ["reset"],
  help: [
    {
      argument: null,
      effect: "Disconnects me and reconnects right after",
    },
  ],
  access: "dev",

  async action({ msg, send }) {
    await send.info("Restarting ...");
    await salty.restart();
  },
};

export default command;
