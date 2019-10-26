import Command from '../../classes/Command.js';

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
    	await this.embed(msg, { title: "Restarting ...", type: 'success' });
        await this.restart();
    },
});

