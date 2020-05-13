import Command, {
    CommandVisiblity,
    CommandParams,
} from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { answers } from "../../terms";

class StopCommand extends Command {
    public name = "stop";
    public keys = [];
    public help = [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ];
    public visibility = <CommandVisiblity>"admin";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.stop();
            Salty.success(msg, choice(answers.bye), {
                react: "⏹",
            });
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    }
}

export default StopCommand;
