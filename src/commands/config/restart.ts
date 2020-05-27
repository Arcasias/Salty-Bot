import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

Command.register({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    access: "dev",

    async action({ msg }) {
        await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    },
});
