import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import User from '../../classes/User.js';

export default new Command({
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
    async action(msg, args) {

        await Salty.embed(msg, { title: msg.mentions.users.first() ?
            `${ msg.mentions.members.first().nickname } currently has ${ User.get(msg.mentions.users.first().id).gold } gold` :
            `you have ${ User.get(msg.author.id).gold } gold` });
    },
});

