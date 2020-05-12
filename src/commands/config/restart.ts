import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

export default new Command({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    visibility: "dev",
    async action({ msg }) {
        await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    },
});
