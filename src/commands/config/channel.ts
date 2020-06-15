import { TextChannel } from "discord.js";
import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { meaning } from "../../utils";

Command.register({
    name: "channel",
    aliases: ["chan"],
    category: "config",
    help: [
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
    ],
    access: "admin",
    channel: "guild",

    async action({ args, msg }) {
        const guild = Guild.get(msg.guild!.id)!;
        switch (meaning(args[0])) {
            case "add":
            case "set": {
                await Guild.update(guild.id, {
                    default_channel: msg.channel.id,
                });
                return Salty.success(
                    msg,
                    `channel **${
                        (<TextChannel>msg.channel).name
                    }** has been successfuly set as default bot channel for **${
                        msg.guild!.name
                    }**`
                );
            }
            case "remove": {
                if (!guild.default_channel) {
                    return Salty.message(msg, "no default bot channel set");
                }
                await Guild.update(guild.id, { default_channel: null });
                return Salty.success(
                    msg,
                    "default bot channel has been successfuly removed"
                );
            }
            default: {
                if (!guild.default_channel) {
                    return Salty.message(msg, "no default bot channel set");
                }
                const { name } = Salty.getTextChannel(guild.default_channel);
                if (msg.channel.id === guild.default_channel) {
                    return Salty.embed(msg, {
                        title: "this is the current default channel",
                        description: "I'll speak right here when I need to",
                    });
                } else {
                    return Salty.embed(msg, {
                        title: `default bot channel is **${name}**`,
                        description: "this is where I'll speak when I need to",
                    });
                }
            }
        }
    },
});
