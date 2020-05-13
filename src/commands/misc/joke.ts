import Command, { CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { jokes } from "../../terms";

class JokeCommand extends Command {
    public name = "joke";
    public keys = ["fun", "haha", "jest", "joker", "jokes"];
    public help = [
        {
            argument: null,
            effect: "Tells some spicy jokes!",
        },
    ];

    async action({ msg }: CommandParams) {
        await Salty.message(msg, choice(jokes));
    }
}

export default JokeCommand;
