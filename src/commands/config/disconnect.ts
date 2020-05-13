import Command, {
    CommandVisiblity,
    CommandParams,
} from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { answers } from "../../terms";

class DisconnectCommand extends Command {
    public name = "disconnect";
    public help = [
        {
            argument: null,
            effect:
                "Disconnects me and terminates my program. Think wisely before using this one, ok?",
        },
    ];
    public visibility = <CommandVisiblity>"dev";

    async action({ msg }: CommandParams) {
        await Salty.success(msg, `${choice(answers.bye)} ♥`);
        await Salty.destroy();
    }
}

export default DisconnectCommand;
