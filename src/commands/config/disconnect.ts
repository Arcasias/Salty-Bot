import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { answers } from "../../list";

export default new Command({
    name: "disconnect",
    keys: [],
    help: [
        {
            argument: null,
            effect:
                "Disconnects me and terminates my program. Think wisely before using this one, ok?",
        },
    ],
    visibility: "dev",
    async action({ msg }) {
        await Salty.success(msg, `${choice(answers.bye)} ♥`);
        await Salty.destroy();
    },
});
