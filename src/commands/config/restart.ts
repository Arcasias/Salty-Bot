import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

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
        await Salty.info(msg, "Restarting ...");
        await Salty.restart();
    },
});
