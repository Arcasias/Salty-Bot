import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import salty from "../../salty";

Command.register({
    name: "pause",
    aliases: ["freeze"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            try {
                playlist.pause();
                salty.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            } catch (err) {
                salty.warn(msg, "the song is already paused");
            }
        } else {
            salty.warn(msg, "there's nothing playing");
        }
    },
});
