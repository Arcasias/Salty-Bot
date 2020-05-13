import Command, { CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { fault } from "../../terms";

class FaultCommand extends Command {
    public name = "fault";
    public keys = ["overwatch", "reason"];
    public help = [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ];

    async action({ msg }: CommandParams) {
        const text = (choice(fault.start) + choice(fault.sentence))
            .replace(/<subject>/g, choice(fault.subject))
            .replace(/<reason>/g, choice(fault.reason))
            .replace(/<punishment>/g, choice(fault.punishment));

        await Salty.message(msg, text);
    }
}

export default FaultCommand;
