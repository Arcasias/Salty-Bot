'use strict';

const Command = require('../../classes/Command');
const fs = require('fs');
const path = './assets/img/saltmoji';
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'emoji',
    keys: [
        "emoji",
        "emojis",
        "saltmoji",
        "saltmojis",
    ],
    help: [
        {
            argument: null,
            effect: "Shows my emojis list"
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        fs.readdir(path, (error, files) => {
            if (error) {
                return LOG.error(error);
            }
            let pngs = files.filter(file => file.split('.').pop() === 'png');
            let emojiNames = pngs.map(name => name.split('.').shift());

            if (args[0]) {

                let arg = args[0].toLowerCase();
                let emoji = false;

                if ("rand" === arg || "random" === arg) {
                    emoji = UTIL.choice(emojiNames);                
                } else if (emojiNames.includes(arg)) {
                    emoji = arg;
                }
                if (emoji) {
                    msg.delete();
                    return msg.channel.send({ files: [`${ path }/${ emoji }.png`] });                
                }
            }
            S.embed(msg, {
                title: "list of saltmojis",
                description: emojiNames.join('\n'),
            });
        });
    },
});

