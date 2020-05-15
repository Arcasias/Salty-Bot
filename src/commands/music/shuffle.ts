import Command, { CommandParams, CommandChannel } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

class ShuffleCommand extends Command {
    public name = "shuffle";
    public keys = ["mix"];
    public help = [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ];
    public channel: CommandChannel = "guild";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty.success(msg, "queue shuffled!", { react: "🔀" });
        } else {
            Salty.error(
                msg,
                "don't you think you'd need more than 1 song to make it useful?"
            );
        }
    }
}

export default ShuffleCommand;
