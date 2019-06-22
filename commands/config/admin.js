'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'admin',
    keys: [
        "admin",
        "admins",
        "administrator",
        "administrators",
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
    visibility: 'public', 
    action: function (msg, args) {
        const mention = msg.mentions.users.first();
        const isReqAdmin = S.isAdmin(mention || msg.author, msg.guild);

        // Yes, it's horrendous, I just wanted to have a bit of fun with ternary operators :)
        S.msg(msg, mention ?
            mention.bot ?
                mention.id !== bot.user.id ?
                    "that's just a bot you know, who cares ?"
                    : isReqAdmin ?
                        "of course I'm an admin ;)"
                        : "nope, I'm not an admin on this server :c"
                : isReqAdmin ?
                    "<mention> is a wise and powerful admin"
                    : "<mention> is not an admin"
            : isReqAdmin ?
                "you have been granted the administrators permissions. May your deeds be blessed forever !"
                : "nope, you're not an admin");
    },
});

