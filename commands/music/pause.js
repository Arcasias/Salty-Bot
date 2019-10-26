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
        const vcon = msg.guild.voiceConnection;

        if (vcon) {
            this.embed(msg, { title: `paused **${Guild.get(msg.guild.id).playlist.getPlaying().title}**`, type: 'success', react: '⏸' });
            vcon.dispatcher.pause();
        } else {
            this.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

