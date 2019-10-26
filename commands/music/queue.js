import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';
import * as error from '../../classes/Exception.js';

const limit = 25;

export default new Command({
    name: 'queue',
    keys: [
        "playlist",
        "q",
    ],
    help: [
        {
            argument: null,
            effect: "Shows the current queue. To add something to it, refer to the **play** command"
        },
        {
            argument: "remove ***song number***, ***song number***, ...",
            effect: "Deletes one or several songs from the queue. Numbers must be separated with \",\""
        },
        {
            argument: "clear",
            effect: "Clears the queue"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);

        if (args[0] && this.getList('delete').includes(args[0])) {
            if (! playlist.queue[0]) {
                throw new error.EmptyObject("queue");
            }
            if (! args[1]) {
                throw new error.MissingArg("song number");
            } else {
                args.shift();
            }
            let songs = args.join('').split(',');
            let requestIsArray = Array.isArray(songs);

            if (! requestIsArray) songs = [songs];

            // Checks for validity
            let valid = true;

            songs.forEach(songId => {
                if (valid && isNaN(songId) || playlist.queue.length < songId || songId < 1) {
                    valid = false;
                }
            });
            if (! valid) {
                throw new error.OutOfRange(songs.join(', '));
            }
            let endSong = (songs.includes(playlist.pointer + 1) && msg.guild.voiceConnection);
            let removed;

            songs.forEach((songId, i) => {
                songs[i] --;
                if (songId < playlist.pointer) {
                    playlist.pointer --;
                }
            });

            removed = playlist.removeSong(UTIL.sortArray(songs));

            if (endSong) playlist.dispatcher.end();

            let message = requestIsArray ?
                `Songs n°${args.join(" ")} removed from the queue` :
                `Song n°${songs[0]} - **${removed.title}** removed from the queue`;

            this.embed(msg, { title: message, type: 'success' });

        } else if (args[0] && this.getList('clear').includes(args[0])) {
            playlist.queueClear();

            this.embed(msg, { title: "queue cleared", type: 'success' });

        } else {
            if (! playlist.queue[0]) {
                throw new error.EmptyObject("queue");
            }
            let duration = 0;
            let options = {
                title: "current queue",
                fields: [],
                footer: `repeat: ${ playlist.repeat }`,
            };

            // Returns an embed message displaying all songs

            let currentlyPlaying, marker = "";
            let ptr;

            if (msg.guild.voiceConnection) {
                let playlistTitle = playlist.getPlaying().title;
                let title = 20 < playlistTitle.length ?
                    playlistTitle.slice(0, 20) + "..." :
                    playlistTitle;
                currentlyPlaying = ". Currently playing: " + title;
                ptr = playlist.pointer;
            }
            playlist.queue.forEach((song, i) => {
                if (limit <= i) return;
                duration += song.duration;

                let name = `${i + 1}) ${song.title}`;
                let desc = `${this.formatDuration(song.duration)} - [Open in browser](${song.url})`;

                if (ptr == i) name = "> " + name;

                options.fields.push({ title: name, description: desc });

                i ++;
            });
            options.description = `total duration: ${this.formatDuration(duration) + currentlyPlaying}`;

            this.embed(msg, options);
        }
    },
});

