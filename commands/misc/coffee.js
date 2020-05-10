'use strict';

const Command = require('../../classes/Command.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'coffee',
    keys: [
        "cof",
        "covfefe",
    ],
    help: [
        {
            argument: null,
            effect: "Gets you a nice hot coffee"
        },
        {
            argument: "***mention***",
            effect: "Gets the ***mention*** a nice hot coffee"
        },
    ],
    visibility: 'public',
    async action(msg) {
        const { author } = msg;
        const mention = msg.mentions.users.first() ? msg.mentions.users.first() : null;
        const options = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            color: 0x523415,
        };
        if (mention) {
            if (mention.id === Salty.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            } else {
                options.description = `Made with ♥ by **${ author.username }** for **${ mention.username }**`;
            }
        } else {
            if (Salty.fishing[author.id]) {
                if ('coffee' === Salty.fishing[author.id].bait) {
                    options.title = "<author> threw another coffee into the sea";
                    options.description = "you already did that, such a waste:c";
                } else {
                    Salty.fishing[author.id].bait = 'coffee';
                    options.title = "<author> just threw a coffee into the sea !";
                    options.description = "what could possibly happen ?";
                }
            }
        }
        await Salty.embed(msg, options);
    },
});
