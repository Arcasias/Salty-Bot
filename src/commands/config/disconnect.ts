import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { answers } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "disconnect",
    aliases: ["destroy"],
    category: "config",
    help: [
        {
            argument: null,
            effect:
                "Disconnects me and terminates my program. Think wisely before using this one, ok?",
        },
    ],
    access: "dev",

    async action({ msg }) {
        await Salty.info(msg, `${choice(answers.bye)} ♥`);
        await Salty.destroy();
    },
});
