import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'resume',
    keys: [
        "unfreeze",
    ],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            try {
                playlist.resume();
                this.embed(msg, { title: `resumed **${playlist.playing.title}**`, type: 'success', react: '▶' });
            } catch (err) {
                this.embed(msg, { title: "the song isn't paused", type: 'error' });
            }
        } else {
            this.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

