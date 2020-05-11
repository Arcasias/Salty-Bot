import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

export default new Command({
    name: "disconnect",
    keys: [],
    help: [
        {
            argument: null,
            effect:
                "Disconnects me and terminates my program. Think wisely before using this one, ok ?",
        },
    ],
    visibility: "dev",
    async action() {
        await Salty.success(`${choice(Salty.getList("answers")["bye"])} ♥`);
        await Salty.destroy();
    },
});
