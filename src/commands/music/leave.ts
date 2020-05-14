import Command, { CommandAccess, CommandParams } from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { TextChannel } from "discord.js";

class LeaveCommand extends Command {
    public name = "leave";
    public keys = ["exit", "quit"];
    public help = [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ];
    public access: CommandAccess = "admin";

    async action({ msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.end();
            Salty.success(
                msg,
                `leaving **${(<TextChannel>msg.channel).name}**`
            );
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    }
}

export default LeaveCommand;
