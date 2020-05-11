import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

export default new Command({
    name: "skip",
    keys: ["next"],
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

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
    },
});
