import Command from '../../classes/Command.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'choose',
    keys: [
        "choice",
        "chose",
        "shoes",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok ?"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        if (! args[0] || ! args[1]) {
            throw new error.MissingArg("choices");
        }
        await this.msg(msg, `I choose ${UTIL.choice(args.join(" ").split('/'))}`);
    },
});

