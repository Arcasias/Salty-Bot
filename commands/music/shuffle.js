import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'shuffle',
    keys: [
        "mix",
    ],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.queue.length > 2) {
            playlist.shuffle();
            this.embed(msg, { title: "queue shuffled !", type: 'success', react: '🔀' });
        } else {
            this.embed(msg, { title: "don't you think you'd need more than 1 song to make it useful ?", type: 'error' });
        }
    },
});

