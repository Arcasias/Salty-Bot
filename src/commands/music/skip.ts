import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

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
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            playlist.skip();
            Salty.success(
                msg,
                `skipped **${playlist.playing.title}**, but it was trash anyway`,
                { react: "⏩" }
            );
        } else {
            Salty.warn(msg, "I'm not connected to a voice channel");
        }
    },
});
