import Command, { CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { predictions } from "../../terms";
import { shuffle, randInt, ellipsis } from "../../utils";

class FutureCommand extends Command {
    public name = "future";
    public keys = ["predict"];
    public help = [
        {
            argument: null,
            effect: "",
        },
    ];

    async action({ msg }: CommandParams) {
        const pred = [];
        for (const prediction of predictions) {
            pred.push(...new Array(randInt(2, 4)).fill(prediction));
        }
        const shuffled = shuffle(pred);
        const ellipsed = ellipsis(shuffled.join(" ||||"), 1995);
        Salty.message(msg, `||${ellipsed}||`);
    }
}

export default FutureCommand;
