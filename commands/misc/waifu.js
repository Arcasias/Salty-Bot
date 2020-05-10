'use strict';

const Command = require('../../classes/Command.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'waifu',
    keys: [
        "waifus",
    ],
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time"
        },
    ],
    visibility: 'public',
    async action(msg) {
        const { name, anime, image } = UTIL.choice(Salty.getList('waifus'));
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: UTIL.choice(image),
        });
    },
});
