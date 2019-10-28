import Command from '../../classes/Command.js';
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
            this.embed(msg, { title: `skipped **${playlist.getPlaying().title}**, but it was trash anyway`, type: 'success', react: '⏩' });
        } else {
            this.embed(msg, { title: "I'm not connected to a voice channel", type: 'error' });
        }
    },
});

