import Command from "../../classes/Command";
import Playlist from "../../classes/Playlist";
import salty from "../../salty";
import { answers } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "stop",
    category: "music",
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    access: "admin",
    channel: "guild",

    async action({ msg }) {
        const playlist = Playlist.get(msg.guild!.id);

        if (playlist.connection) {
            playlist.stop();
            salty.success(msg, choice(answers.bye), {
                react: "⏹",
            });
        } else {
            salty.warn(msg, "I'm not in a voice channel");
        }
    },
});
