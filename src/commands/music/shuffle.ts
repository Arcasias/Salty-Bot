import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

Command.register({
    name: "shuffle",
    aliases: ["mix"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ],
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty.success(msg, "queue shuffled!", { react: "🔀" });
        } else {
            Salty.warn(
                msg,
                "don't you think you'd need more than 1 song to make it useful?"
            );
        }
    },
});
