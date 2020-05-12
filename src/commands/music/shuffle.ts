import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

export default new Command({
    name: "shuffle",
    keys: ["mix"],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ],
    visibility: "public",
    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty.success(msg, "queue shuffled!", { react: "🔀" });
        } else {
            Salty.error(
                msg,
                "don't you think you'd need more than 1 song to make it useful?"
            );
        }
    },
});
