import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import salty from "../../salty";

Command.register({
    name: "join",
    category: "music",
    help: [
        {
            argument: null,
            effect: "Joins your voice channel",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;
        if (playlist.connection) {
            return salty.warn(msg, "I'm not in a voice channel.");
        }
        if (!msg.member?.voice.channel) {
            return salty.warn(msg, "You're not in a voice channel.");
        }
        playlist.join(msg.member.voice.channel);
    },
});
