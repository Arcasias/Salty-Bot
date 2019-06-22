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
    action: function (msg, args) {
        let { name, anime, image } = UTIL.choice(S.getList('waifus'));
        S.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: UTIL.choice(image),
        });
    },
});

