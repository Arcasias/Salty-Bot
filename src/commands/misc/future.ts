import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { predictions } from "../../terms";
import { ellipsis, randInt, shuffle } from "../../utils";

Command.register({
    name: "future",
    keys: ["predict"],
    help: [
        {
            argument: null,
            effect: "",
        },
    ],

    async action({ msg }) {
        const pred = [];
        for (const prediction of predictions) {
            pred.push(...new Array(randInt(2, 4)).fill(prediction));
        }
        const shuffled = shuffle(pred);
        const ellipsed = ellipsis(shuffled.join(" ||||"), 1995);
        Salty.message(msg, `||${ellipsed}||`);
    },
});
