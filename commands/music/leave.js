import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'leave',
    keys: [
        "exit",
        "quit",
    ],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel"
        },
    ],
    visibility: 'admin',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.end();
            this.embed(msg, { title: `leaving **${chanName}**`, type: 'success' });
        } else {
            this.embed(msg, { title: "I'm not in a voice channel", type: 'error' });
        }
    },
});

