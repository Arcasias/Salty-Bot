'use strict';

const Command = require('../../classes/Command');
const User = require('../../classes/User');
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
    action: async function (msg, args) {
        const { author } = msg;
        const mention = msg.mentions.members.first();
        const user = mention ? User.get(mention.user.id) : null;

        if (args[0] && S.getList('add').includes(args[0])) {
            if (! mention) {
                throw new error.MissingMention();
            }
            if (mention.id === S.bot.user.id) {
                return S.msg(msg, "Woa woa woa ! You can't just put me in my own blacklist you punk !");
            }
            await User.update(user.id, { black_listed: true });
            await S.embed(msg, { title: `<mention> added to the blacklist`, type: 'success' });

        } else if (args[0] && S.getList('delete').includes(args[0])) {
            if (! mention) {
                throw new error.MissingMention();
            }
            if (mention.id === S.bot.user.id) {
                return S.msg(msg, "Well... as you might expect, I'm not in the blacklist.");
            }
            if (!user.black_listed) {
                throw new error.SaltyException(`**${mention.nickname}** is not in the blacklist`);
            }
            await User.update(user.id, { black_listed: false });
            await S.embed(msg, { title: `<mention> removed from the blacklist`, type: 'success' });

        } else {
            if (mention) {
                if (mention.id === S.bot.user.id) {
                    await S.msg(msg, "Nope, I am not and will never be in the blacklist");
                } else {
                    await S.msg(msg, user.black_listed ? "<mention> is black-listed" : "<mention> isn't black-listed... yet");
                }
            } else {
                const blackListedUsers = User.filter(u => u.black_listed).map(u => S.bot.users.get(u.discord_id).username);
                if (blackListedUsers.length) {
                    await S.embed(msg, { title: "Blacklist", description: blackListedUsers.join("\n") });
                } else {
                    await S.msg(msg, "The black list is empty. You can help by *expanding it*.");
                }
            }
        }
    },
});

