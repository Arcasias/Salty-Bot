import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
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
            Salty.success(msg, `leaving **${chanName}**`);
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});

