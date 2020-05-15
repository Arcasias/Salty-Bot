import Command, { CommandParams, CommandChannel } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

class PauseCommand extends Command {
    public name = "pause";
    public keys = ["freeze"];
    public help = [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ];
    public channel: CommandChannel = "guild";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            try {
                playlist.pause();
                Salty.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            } catch (err) {
                Salty.error(msg, "the song is already paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    }
}

export default PauseCommand;
