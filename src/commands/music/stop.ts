import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { answers } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "stop",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    access: "admin",
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

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
