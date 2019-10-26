import Command from '../../classes/Command.js';

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
        await this.msg(msg, UTIL.choice(this.getList('jokes')));
    },
});

