'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'gold',
    keys: [
        "gold",
        "golds",
        "money",
        "wallet",
        "coins",
        "purse",
    ],
    help: [
        {
            argument: null,
            effect: "Shows your amount of gold"
        },
        {
            argument: "***mention***",
            effect: "Shows the amount of gold of ***mention***"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {

        await S.embed(msg, { title: msg.mentions.users.first() ?
            `${ msg.mentions.members.first().nickname } currently has ${ User.get(msg.mentions.users.first().id).gold } gold`
            : `you have ${ User.get(msg.author.id).gold } gold` });
    },
});

