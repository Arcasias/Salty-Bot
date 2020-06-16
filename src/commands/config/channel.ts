import { TextChannel } from "discord.js";
import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import salty from "../../salty";
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
                return salty.success(
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
                    return salty.info(msg, "no default bot channel set");
                }
                await Guild.update(guild.id, { default_channel: null });
                return salty.success(
                    msg,
                    "default bot channel has been successfuly removed"
                );
            }
            default: {
                if (!guild.default_channel) {
                    return salty.info(msg, "no default bot channel set");
                }
                const { name } = salty.getTextChannel(guild.default_channel);
                if (msg.channel.id === guild.default_channel) {
                    return salty.info(
                        msg,
                        "this is the current default channel",
                        { description: "I'll speak right here when I need to" }
                    );
                } else {
                    return salty.info(
                        msg,
                        `default bot channel is **${name}**`,
                        {
                            description:
                                "this is where I'll speak when I need to",
                        }
                    );
                }
            }
        }
    },
});
