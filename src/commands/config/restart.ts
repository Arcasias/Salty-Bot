import Command, {
    CommandVisiblity,
    CommandParams,
} from "../../classes/Command";
import Salty from "../../classes/Salty";

class RestartCommand extends Command {
    public name = "restart";
    public keys = ["reset"];
    public help = [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ];
    public visibility = <CommandVisiblity>"dev";

    async action({ msg }: CommandParams) {
        await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    }
}

export default RestartCommand;
