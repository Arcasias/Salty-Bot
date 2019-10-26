import Command from '../../classes/Command.js';

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
        await this.embed(msg, {
            title: `${ UTIL.choice(this.getList('answers')['bye']) } ♥`,
            type: 'success',
        });
        await this.destroy();
    },
});

