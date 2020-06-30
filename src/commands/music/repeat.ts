import Command from "../../classes/Command";
import Playlist from "../../classes/Playlist";
import salty from "../../salty";

Command.register({
    name: "repeat",
    aliases: ["loop", "rep", "replay"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Toggles repeat all/off for the queue",
        },
        {
            argument: "single",
            effect: "Repeats the current song",
        },
        {
            argument: "all",
            effect: "Repeat the whole queue",
        },
        {
            argument: "off",
            effect: "Disables repeat",
        },
    ],
    channel: "guild",

    async action({ args, msg }) {
        const playlist = Playlist.get(msg.guild!.id);

        const single = () => {
            playlist.repeat = "single";
            salty.success(msg, "I will now repeat the current song", {
                react: "🔂",
            });
        };
        const all = () => {
            playlist.repeat = "all";
            salty.success(msg, "I will now repeat the whole queue", {
                react: "🔁",
            });
        };
        const off = () => {
            playlist.repeat = "off";
            salty.success(msg, "repeat disabled", { react: "❎" });
        };

        if (["single", "1", "one", "this"].includes(args[0])) {
            single();
        } else if (["all", "queue", "q"].includes(args[0])) {
            all();
        } else if (["off", "disable", "0"].includes(args[0])) {
            off();
        } else {
            if (playlist.repeat === "off") {
                all();
            } else {
                off();
            }
        }
    },
});
