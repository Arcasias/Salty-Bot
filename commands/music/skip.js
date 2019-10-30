import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'skip',
    keys: [
        "next",
    ],
    help: [
        {
            argument: null,
            effect: "Skips to the next song"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.skip();
            Salty.success(msg, `skipped **${playlist.getPlaying().title}**, but it was trash anyway`, { react: '⏩' });
        } else {
            Salty.error(msg, "I'm not connected to a voice channel");
        }
    },
});

