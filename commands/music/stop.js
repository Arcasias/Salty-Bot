import Command from '../../classes/Command.js';
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
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;

        if (playlist.queue[0]) {
            if (vcon) {
                vcon.channel.leave();
            }
            playlist.queueClear();
            this.embed(msg, {
                title: UTIL.choice(this.getList('answers')['bye']),
                type: 'success',
                react: '⏹',
            });
        } else {
            this.embed(msg, {
                title: "I'm not in a voice channel",
                type: 'error',
            });
        }
    },
});

