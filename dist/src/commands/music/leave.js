import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "leave",
    keys: ["exit", "quit"],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    visibility: "admin",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);
        if (playlist.connection) {
            playlist.end();
            Salty.success(msg, `leaving **${msg.channel.name}**`);
        }
        else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
