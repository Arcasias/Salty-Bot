import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';

export default new Command({
    name: 'joke',
    keys: [
        "fun",
        "haha",
        "jest",
        "joker",
        "jokes",
    ],
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes !"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        await Salty.message(msg, UTIL.choice(Salty.getList('jokes')));
    },
});

