import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

Command.register({
    name: "resume",
    aliases: ["unfreeze"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            try {
                playlist.resume();
                Salty.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            } catch (err) {
                Salty.warn(msg, "the song isn't paused");
            }
        } else {
            Salty.warn(msg, "there's nothing playing");
        }
    },
});
