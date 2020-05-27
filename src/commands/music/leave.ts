import { TextChannel } from "discord.js";
import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

Command.register({
    name: "leave",
    keys: ["exit", "quit"],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    access: "admin",
    channel: "guild",

    async action({ msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        if (playlist.connection) {
            playlist.end();
            Salty.success(
                msg,
                `leaving **${(<TextChannel>msg.channel).name}**`
            );
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
