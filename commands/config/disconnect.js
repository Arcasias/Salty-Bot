import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';

export default new Command({
    name: 'disconnect',
    keys: [],
    help: [
        {
            argument: null,
            effect: "Disconnects me and terminates my program. Think wisely before using this one, ok ?"
        }
    ],
    visibility: 'dev',
    async action(msg, args) {
        await Salty.success(`${ UTIL.choice(Salty.getList('answers')['bye']) } ♥`);
        await Salty.destroy();
    },
});

