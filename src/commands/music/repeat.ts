import Command, { CommandParams, CommandChannel } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";

class RepeatCommand extends Command {
    public name = "repeat";
    public keys = ["loop", "rep", "replay"];
    public help = [
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
    ];
    public channel: CommandChannel = "guild";

    async action({ args, msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        const single = () => {
            playlist.repeat = "single";
            Salty.success(msg, "I will now repeat the current song", {
                react: "🔂",
            });
        };
        const all = () => {
            playlist.repeat = "all";
            Salty.success(msg, "I will now repeat the whole queue", {
                react: "🔁",
            });
        };
        const off = () => {
            playlist.repeat = "off";
            Salty.success(msg, "repeat disabled", { react: "❎" });
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
    }
}

export default RepeatCommand;
