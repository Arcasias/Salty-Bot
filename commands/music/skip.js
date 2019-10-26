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
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;

        if (vcon) {
            if (this.isAdmin(msg.author, msg.guild) || playlist.pointer + 1 in playlist.queue) {
                this.embed(msg, { title: `skipped **${playlist.getPlaying().title}**, but it was trash anyway`, type: 'success', react: '⏩' });

                if ('single' === playlist.repeat) {
                    playlist.pointer ++;
                }
                vcon.dispatcher.end();
            } else {
                this.embed(msg, { title: "you're not in the admin list", type: 'error' });
            }
        } else {
            this.embed(msg, { title: "I'm not connected to a voice channel", type: 'error' });
        }
    },
});

