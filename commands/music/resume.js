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
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;

        if (vcon) {
            if (vcon.dispatcher.paused) {
                this.embed(msg, { title: `resumed **${playlist.getPlaying().title}**`, type: 'success', react: '▶' });
                vcon.dispatcher.resume();
            } else {
                this.embed(msg, { title: "the song isn't paused", type: 'error' });
            }
        } else {
            this.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

