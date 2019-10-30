import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';

export default new Command({
    name: 'fault',
    keys: [
        "overwatch",
        "reason",
    ],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        const fault = Salty.getList('fault');
        const text = (UTIL.choice(fault.start) + UTIL.choice(fault.sentence))
            .replace(/<subject>/g, UTIL.choice(fault.subject))
            .replace(/<reason>/g, UTIL.choice(fault.reason))
            .replace(/<punishment>/g, UTIL.choice(fault.punishment));

        await Salty.message(msg, text);
    },
});

