import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'pause',
    keys: [
        "freeze",
    ],
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            try {
                playlist.pause();
                this.embed(msg, { title: `paused **${playlist.playing.title}**`, type: 'success', react: '⏸' });
            } catch (err) {
                this.embed(msg, { title: "the song is already paused", type: 'error' });
            }
        } else {
            this.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

