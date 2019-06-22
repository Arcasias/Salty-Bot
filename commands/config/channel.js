'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'channel',
    keys: [
        "channel",
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
    action: function (msg, args) {
        let guild = Guild.get(msg.guild.id);

        if (args[0] && S.getList('add').includes(args[0])) {
            guild.defaultChannel = msg.channel.id;

            S.embed(msg, { title: `channel **${ msg.channel.name }** has been successfuly set as default bot channel for **${ msg.guild.name }**`, type: 'success' });
        } else if (args[0] && S.getList('delete').includes(args[0])) {
            if (! guild.defaultChannel) {
                return S.msg(msg, "no default bot channel set");
            }
            guild.defaultChannel = null;

            S.embed(msg, { title: "default bot channel has been successfuly removed", type: 'success' });
        } else {
            if (! guild.defaultChannel) {
                return S.msg(msg, "no default bot channel set");
            }
            let chanName = bot.channels.get(guild.defaultChannel).name;

            if (msg.channel.id == guild.defaultChannel) {
                S.embed(msg, { title: "this is the current default channel", description: "I'll speak right here when I need to" });
            } else {
                S.embed(msg, { title: `default bot channel is **${ chanName }**`, description: "this is where I'll speak when I need to" });
            }
        }
    },
});

