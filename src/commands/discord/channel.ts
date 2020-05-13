import Command, {
    CommandVisiblity,
    CommandParams,
} from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { add, remove } from "../../terms";
import { TextChannel } from "discord.js";

class ChannelCommand extends Command {
    public name = "channel";
    public keys = ["chan"];
    public help = [
        {
            argument: null,
            effect: "Shows the current default channel",
        },
        {
            argument: "set",
            effect: "Sets this channel as the default one for this server",
        },
        {
            argument: "unset",
            effect: "Unsets this server's default channel",
        },
    ];
    public visibility = <CommandVisiblity>"admin";

    async action({ args, msg }: CommandParams) {
        const guild = Guild.get(msg.guild.id);

        if (args[0] && add.includes(args[0])) {
            await Guild.update(guild.id, { default_channel: msg.channel.id });
            await Salty.success(
                msg,
                `channel **${
                    (<TextChannel>msg.channel).name
                }** has been successfuly set as default bot channel for **${
                    msg.guild.name
                }**`
            );
        } else if (args[0] && remove.includes(args[0])) {
            if (!guild.default_channel) {
                return Salty.message(msg, "no default bot channel set");
            }
            await Guild.update(guild.id, { default_channel: null });
            await Salty.success(
                msg,
                "default bot channel has been successfuly removed"
            );
        } else {
            if (!guild.default_channel) {
                return Salty.message(msg, "no default bot channel set");
            }
            const { name } = Salty.getTextChannel(guild.default_channel);
            if (msg.channel.id === guild.default_channel) {
                await Salty.embed(msg, {
                    title: "this is the current default channel",
                    description: "I'll speak right here when I need to",
                });
            } else {
                await Salty.embed(msg, {
                    title: `default bot channel is **${name}**`,
                    description: "this is where I'll speak when I need to",
                });
            }
        }
    }
}

export default ChannelCommand;
