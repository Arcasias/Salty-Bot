'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'waifu',
    keys: [
        "waifu",
        "waifus",
    ],
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        const { name, anime, image } = UTIL.choice(S.getList('waifus'));
        await S.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: UTIL.choice(image),
        });
    },
});

