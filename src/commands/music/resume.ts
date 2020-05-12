import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

export default new Command({
    name: "resume",
    keys: ["unfreeze"],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ],
    visibility: "public",
    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            try {
                playlist.resume();
                Salty.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            } catch (err) {
                Salty.error(msg, "the song isn't paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    },
});
