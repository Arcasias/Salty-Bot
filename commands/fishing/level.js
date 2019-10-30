import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import User from '../../classes/User.js';

export default new Command({
    name: 'level',
    keys: [
        "exp",
        "experience",
        "lvl",
        "rank",
        "xp",
    ],
    help: [
        {
            argument: null,
            effect: "Shows your current level"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        const authorId = msg.author.id;
        const rank = Salty.config.rank[User.get(authorId).rank];
        const rankProps = Salty.config.quality[rank.quality];

        const options = {
            title: `${ msg.member.displayName } is rank ${ User.get(authorId).rank }: ${ rank.name }`,
            color: rankProps.color,
            description: `Experience: ${ Math.floor(Salty.getXpInfos(authorId).xp) }/${ rank.xp }`,
        };

        await Salty.embed(msg, options);
    },
});

