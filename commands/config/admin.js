'use strict';

const Command = require('../../classes/Command.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'admin',
    keys: [
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
    async action(msg) {
        const mention = msg.mentions.users.first();
        const isRequestedUserAdmin = Salty.isAdmin(mention || msg.author, msg.guild);

        // Fuck else if structures, long live ternary operators
        await Salty.message(msg,
            mention ?
                // mention
                mention.id === Salty.bot.user.id ?
                    // mention is Salty
                    isRequestedUserAdmin ?
                        // mention is Salty and is admin
                        "of course I'm an admin ;)" :
                        // mention is Salty and not admin
                        "nope, I'm not an admin on this server :c" :
                    // mention is not Salty
                    isRequestedUserAdmin ?
                        // mention is not Salty and is admin
                        "<mention> is a wise and powerful admin" :
                        // mention is not Salty and is not admin
                        "<mention> is not an admin" :
                // author
                isRequestedUserAdmin ?
                    // author is admin
                    "you have been granted the administrators permissions. May your deeds be blessed forever !" :
                    // author is not admin
                    "nope, you're not an admin");
    },
});
