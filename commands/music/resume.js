import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
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
                Salty.success(msg, `resumed **${playlist.playing.title}**`, { react: '▶' });
            } catch (err) {
                Salty.error(msg, "the song isn't paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    },
});

