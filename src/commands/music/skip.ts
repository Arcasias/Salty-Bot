import Command, { CommandParams, CommandChannel } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

class SkipCommand extends Command {
    public name = "skip";
    public keys = ["next"];
    public help = [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ];
    public channel: CommandChannel = "guild";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            playlist.skip();
            Salty.success(
                msg,
                `skipped **${playlist.playing.title}**, but it was trash anyway`,
                { react: "⏩" }
            );
        } else {
            Salty.error(msg, "I'm not connected to a voice channel");
        }
    }
}

export default SkipCommand;
