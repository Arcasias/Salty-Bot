import Command from "../../classes/Command";
import salty from "../../salty";

Command.register({
  name: "restart",
  aliases: ["reset"],
  category: "config",
  help: [
    {
      argument: null,
      effect: "Disconnects me and reconnects right after",
    },
  ],
  access: "dev",

  async action({ msg }) {
    await salty.info(msg, "Restarting ...");
    await salty.restart();
  },
});
