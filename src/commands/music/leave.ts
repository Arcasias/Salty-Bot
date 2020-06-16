import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import salty from "../../salty";

Command.register({
    name: "leave",
    aliases: ["exit", "quit"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;
        const channel = playlist.leave();
        if (!playlist.connection || !channel) {
            return salty.warn(msg, "I'm not in a voice channel.");
        }
        salty.info(msg, `Leaving **${channel.name}**.`);
    },
});
