import Command from '../../classes/Command.js';

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
        const vcon = msg.guild.voiceConnection;
        if (vcon) {
            const chanName = vcon.channel.name;
            vcon.channel.leave();
            this.embed(msg, { title: `leaving **${chanName}**`, type: 'success' });
        } else {
            this.embed(msg, { title: "I'm not in a voice channel", type: 'error' });
        }
    },
});

