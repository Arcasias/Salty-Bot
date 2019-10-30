import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'stop',
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue"
        },
    ],
    visibility: 'admin',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.stop();
            Salty.success(msg, UTIL.choice(Salty.getList('answers')['bye']), { react: '⏹' });
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});

