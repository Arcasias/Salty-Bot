import Command from "../../classes/Command";
import Playlist from "../../classes/Playlist";
import salty from "../../salty";

Command.register({
    name: "skip",
    aliases: ["next"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const playlist = Playlist.get(msg.guild!.id);

        if (playlist.connection) {
            playlist.skip();
            salty.success(
                msg,
                `skipped **${playlist.playing.title}**, but it was trash anyway`,
                { react: "⏩" }
            );
        } else {
            salty.warn(msg, "I'm not connected to a voice channel");
        }
    },
});
