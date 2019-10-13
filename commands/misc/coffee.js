'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'coffee',
    keys: [
        "coffee",
        "covfefe",
        "cof",
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
    action: async function (msg, args) {
        const { author } = msg;
        const mention = msg.mentions.users.first() ? msg.mentions.users.first() : null;
        const options = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            color: 0x523415,
        };
        if (mention) {
            if (mention.id == S.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^"; 
            } else {
                desc = `Made with ♥ by **${ author.username }** for **${ mention.username }**`;
            }
        } else {
            if (S.fishing[author.id]) {
                if ('coffee' == S.fishing[author.id].bait) {
                    options.title = "<author> threw another coffee into the sea";
                    options.description = "you already did that, such a waste:c";
                } else {
                    S.fishing[author.id].bait = 'coffee';
                    options.title = "<author> just threw a coffee into the sea !";
                    options.description = "what could possibly happen ?";
                }        
            }
        }
        await S.embed(msg, options);
    },
});

