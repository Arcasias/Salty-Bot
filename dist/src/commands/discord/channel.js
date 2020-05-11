import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "channel",
    keys: ["chan"],
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
    visibility: "admin",
    async action(msg, args) {
        const guild = Guild.get(msg.guild.id);
        if (args[0] && Salty.getList("add").includes(args[0])) {
            await Guild.update(guild.id, { default_channel: msg.channel.id });
            await Salty.success(msg, `channel **${msg.channel.name}** has been successfuly set as default bot channel for **${msg.guild.name}**`);
        }
        else if (args[0] && Salty.getList("delete").includes(args[0])) {
            if (!guild.default_channel) {
                return Salty.message(msg, "no default bot channel set");
            }
            await Guild.update(guild.id, { default_channel: null });
            await Salty.success(msg, "default bot channel has been successfuly removed");
        }
        else {
            if (!guild.default_channel) {
                return Salty.message(msg, "no default bot channel set");
            }
            const chanName = Salty.bot.channels.get(guild.default_channel).name;
            if (parseInt(msg.channel.id) === parseInt(guild.default_channel)) {
                await Salty.embed(msg, {
                    title: "this is the current default channel",
                    description: "I'll speak right here when I need to",
                });
            }
            else {
                await Salty.embed(msg, {
                    title: `default bot channel is **${chanName}**`,
                    description: "this is where I'll speak when I need to",
                });
            }
        }
    },
});
