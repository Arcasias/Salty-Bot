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
    action: function (msg, args) {
        let authorId = msg.author.id;
        let rank = S.config.rank[User.get(authorId).rank];
        let rankProps = S.config.quality[rank.quality];

        let options = {

            title: `${ msg.member.displayName } is rank ${ User.get(authorId).rank }: ${ rank.name }`,
            color: rankProps.color,
            description: `Experience: ${ Math.floor(S.getXpInfos(authorId).xp) }/${ rank.xp }`,
        };

        S.embed(msg, options);
    },
});

