import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';

export default new Command({
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
    async action(msg, args) {
        const { name, anime, image } = UTIL.choice(Salty.getList('waifus'));
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: UTIL.choice(image),
        });
    },
});

