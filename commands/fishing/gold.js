'use strict';

const Command = require('../../classes/Command.js');
const Salty = require('../../classes/Salty.js');
const User = require('../../classes/User.js');

module.exports = new Command({
    name: 'gold',
    keys: [
        "coin",
        "coins",
        "money",
        "purse",
        "wallet",
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
    async action(msg) {

        await Salty.embed(msg, { title: msg.mentions.users.first() ?
            `${ msg.mentions.members.first().nickname } currently has ${ User.get(msg.mentions.users.first().id).gold } gold` :
            `you have ${ User.get(msg.author.id).gold } gold` });
    },
});
