import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { jokes } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "joke",
    aliases: ["fun", "haha", "jest", "joker", "jokes"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes!",
        },
    ],

    async action({ msg }) {
        await Salty.message(msg, choice(jokes));
    },
});
