'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'blacklist',
    keys: [
        "blacklist",
        "blackls",
        "bl",
    ],
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin"
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin"
        },
    ],
    visibility: 'dev', 
    action: function (msg, args) {
        const { author } = msg;
        const mention = msg.mentions.members.first();

        if (args[0] && S.getList('add').includes(args[0])) {
            if (! mention) {
                throw new error.MissingMention();
            }
            S.config.blackList.push(mention.user.id);

            S.embed(msg, { title: `<mention> added to the blacklist`, type: 'success' });

        } else if (args[0] && S.getList('delete').includes(args[0])) {

            if (! mention) {
                throw new error.MissingMention();
            }
            if (! S.config.blackList.includes(mention.user.id)) {
                throw new error.SaltyException(`**${mention.nickname}** is not in the blacklist`);
            }
            S.config.blackList.splice(S.config.blackList.indexOf(mention.user.id), 1);

            S.embed(msg, { title: `<mention> removed from the blacklist`, type: 'success' });

        } else {
            if (mention) {
                S.msg(msg, S.config.blackList.includes(mention.user.id) ? "<mention> is black-listed" : "<mention> isn't black-listed... yet");
            } else {
                S.embed(msg, { title: "Blacklist", description: S.config.blackList.map(id => S.bot.users.get(id).username).join("\n") });
            }
        }
    },
});

