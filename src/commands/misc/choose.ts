import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

Command.register({
    name: "choose",
    keys: ["choice", "chose", "shoes"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect:
                "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
        },
    ],

    async action({ args, msg }) {
        if (args.length < 2) {
            return Salty.warn(msg, "You need to give at least 2 choices.");
        }
        await Salty.message(
            msg,
            `I choose ${choice(args.join(" ").split("/"))}`
        );
    },
});
