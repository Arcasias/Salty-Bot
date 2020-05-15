import Command, { CommandParams, CommandChannel } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

class ResumeCommand extends Command {
    public name = "resume";
    public keys = ["unfreeze"];
    public help = [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ];
    public channel: CommandChannel = "guild";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            try {
                playlist.resume();
                Salty.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            } catch (err) {
                Salty.error(msg, "the song isn't paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    }
}

export default ResumeCommand;
