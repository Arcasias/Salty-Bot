import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';

export default new Command({
    name: 'repeat',
    keys: [
        "loop",
        "rep",
        "replay",
    ],
    help: [
        {
            argument: null,
            effect: "Toggles repeat all/off for the queue"
        },
        {
            argument: "single",
            effect: "Repeats the current song"
        },
        {
            argument: "all",
            effect: "Repeat the whole queue"
        },
        {
            argument: "off",
            effect: "Disables repeat"
        }
    ],
    visibility: 'public',
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);

        const single = () => {
            playlist.repeat = 'single';
            this.embed(msg, { title: "I will now repeat the current song", type: 'success', react: '🔂' });
        };
        const all = () => {
            playlist.repeat = 'all';
            this.embed(msg, { title: "I will now repeat the whole queue", type: 'success', react: '🔁' });
        };
        const off = () => {
            playlist.repeat = 'off';
            this.embed(msg, { title: "repeat disabled", type: 'success', react: '❎' });
        };

        if (['single', '1', 'one', 'this'].includes(args[0])) {
            single();
        } else if (['all', 'queue', 'q'].includes(args[0])) {
            all();
        } else if (['off', 'disable', '0'].includes(args[0])) {
            off();
        } else {
            'off' === playlist.repeat ? all() : off();
        }
    },
});

