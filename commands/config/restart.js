import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';

export default new Command({
    name: 'restart',
    keys: [
        "reset",
    ],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        }
    ],
    visibility: 'dev',
    async action(msg, args) {
    	await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    },
});

