import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'channel',
    keys: [
        "chan",
    ],
    help: [
        {
            argument: null,
            effect: "Shows the current default channel"
        },
        {
            argument: "set",
            effect: "Sets this channel as the default one for this server"
        },
        {
            argument: "unset",
            effect: "Unsets this server's default channel"
        },
    ],
    visibility: 'admin',
    async action(msg, args) {
        const guild = Guild.get(msg.guild.id);

        if (args[0] && this.getList('add').includes(args[0])) {
            await Guild.update(guild.id, { default_channel: msg.channel.id });
            await this.embed(msg, { title: `channel **${ msg.channel.name }** has been successfuly set as default bot channel for **${msg.guild.name}**`, type: 'success' });
        } else if (args[0] && this.getList('delete').includes(args[0])) {
            if (!guild.default_channel) {
                return this.msg(msg, "no default bot channel set");
            }
            await Guild.update(guild.id, { default_channel: null });
            await this.embed(msg, { title: "default bot channel has been successfuly removed", type: 'success' });
        } else {
            if (!guild.default_channel) {
                return this.msg(msg, "no default bot channel set");
            }
            const chanName = this.bot.channels.get(guild.default_channel).name;
            if (parseInt(msg.channel.id) === parseInt(guild.default_channel)) {
                await this.embed(msg, { title: "this is the current default channel", description: "I'll speak right here when I need to" });
            } else {
                await this.embed(msg, { title: `default bot channel is **${chanName}**`, description: "this is where I'll speak when I need to" });
            }
        }
    },
});

