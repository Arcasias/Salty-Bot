'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'level',
    keys: [
        "level",
        "lvl",
        "rank",
        "xp",
        "experience",
    ],
    help: [
        {
            argument: null,
            effect: "Shows your current level"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        const authorId = msg.author.id;
        const rank = S.config.rank[User.get(authorId).rank];
        const rankProps = S.config.quality[rank.quality];

        const options = {
            title: `${ msg.member.displayName } is rank ${ User.get(authorId).rank }: ${ rank.name }`,
            color: rankProps.color,
            description: `Experience: ${ Math.floor(S.getXpInfos(authorId).xp) }/${ rank.xp }`,
        };

        await S.embed(msg, options);
    },
});

