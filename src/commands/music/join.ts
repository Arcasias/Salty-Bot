import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

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
            return Salty.warn(msg, "I'm not in a voice channel.");
        }
        if (!(msg.member?.voice.channel)) {
            return Salty.warn(msg, "You're not in a voice channel.");
        }
        playlist.join(msg.member.voice.channel);
    },
});
