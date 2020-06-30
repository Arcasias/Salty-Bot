import Command from "../../classes/Command";
import Playlist from "../../classes/Playlist";
import salty from "../../salty";

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
        const playlist = Playlist.get(msg.guild!.id);

        if (playlist.connection) {
            try {
                playlist.resume();
                salty.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            } catch (err) {
                salty.warn(msg, "the song isn't paused");
            }
        } else {
            salty.warn(msg, "there's nothing playing");
        }
    },
});
