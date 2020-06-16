import Command from "../../classes/Command";
import salty from "../../salty";
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
        await salty.info(msg, `${choice(answers.bye)} ♥`);
        await salty.destroy();
    },
});
