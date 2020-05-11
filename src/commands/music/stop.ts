import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { answers } from "../../data/list";

export default new Command({
    name: "stop",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    visibility: "admin",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.stop();
            Salty.success(msg, choice(answers.bye), {
                react: "⏹",
            });
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
