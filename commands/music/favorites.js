import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';
import * as error from '../../classes/Exception.js';
import ytdl from 'ytdl-core';

const youtubeURL = 'https://www.youtube.com/watch?v=';
const youtubeRegex = new RegExp(youtubeURL, 'g');
const limit = 25;

export default new Command({
    deprecated: true,
    name: 'favorites',
    keys: [
        "fav",
        "favs",
    ],
    help: [
        {
            argument: null,
            effect: "Shows the list of favorite songs"
        },
        {
            argument: "add ***YouTube video URL***",
            effect: "Adds a song to the favorites playlist"
        },
        {
            argument: "delete ***song number***",
            effect: "Deletes a song from the favorites playlist"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        const { favPlaylist } = Guild.get(msg.guild.id);

        if (args[0] && this.getList('add').includes(args[0])) {
            args.shift();

            if (! args[0]) {
                throw new error.MissingArg("URL");
            }

            const urls = args.join("").split(",");

            if (5 < urls.length) {
                throw new error.SaltyException("you can't add more than 5 songs at once");
            }
            if (25 <= favPlaylist.length + urls.length) {
                throw new error.SaltyException("the playlist is full ! You can delete some songs if you want to add new ones");
            }
            let valid = true;
            let promises = [];

            urls.forEach(songURL => {
                if (! valid) return;
                if (! songURL.match(youtubeRegex)) {
                    valid = false;
                } else {
                    promises.push(new Promise((resolve, reject) => {
                        ytdl.getInfo(songURL, (err, video) => {
                            if (err) {
                                reject(err);
                            } else {
                                favPlaylist.push({ title: video.title, duration: video.length_seconds * 1000, url: songURL });
                                resolve();
                            }
                        });
                    }));
                }
            });
            Promise.all(promises).then(() => {
                if (valid) {
                    const lastSong = favPlaylist[favPlaylist.length - 1].title;
                    this.embed(msg, { title: `**${lastSong}** ${ 1 === urls.length ? "has" : `and **${urls.length - 1}** other songs have` } been successfully added to the favorites playlist`, type: 'success' });
                } else {
                    this.embed(msg, { title: 1 === urls.length ? "the URL you entered is invalid" : "one of the URLs you entered is invalid", type: 'error' });
                }
            }).catch(err => {
                this.embed(msg, { title: err.message, type: 'error' });
            });
        } else if (args[0] && this.getList('delete').includes(args[0])) {
            args.shift();

            if (! favPlaylist[0]) {
                throw new error.EmptyObject("favorite playlist");
            }
            if (! args[0]) {
                throw new error.MissingArg("song number");
            }
            let songs = args.join('').split(',');
            const requestIsArray = Array.isArray(songs);
            if (! requestIsArray) {
                songs = [songs];
            }

            // Checks for validity
            songs.forEach(songId => {
                if (isNaN(songId)) {
                    throw new error.IncorrectValue("song number(s)", "number");
                }
                if (favPlaylist.length < songId || songId < 1) {
                    throw new error.OutOfRange(songId);
                }
            });
            let removed;
            let sortedIds = UTIL.sortArray(songs);

            for (let i = sortedIds.length - 1; 0 <= i; i --) {
                removed = favPlaylist.splice(sortedIds[i] - 1, 1);
            }
            let message = (requestIsArray ? `songs n°${sortedIds.join(", ")}`: `song n°${songs[0]} - **${removed.title}**`) + " removed from the favorites playlist";

            this.embed(msg, { title: message, type: 'success' });

        } else {
            if (! favPlaylist[0]) {
                return this.embed(msg, { title: "the favorites playlist is empty", description: "it's about time somebody added something to it, don't you think ?" });
            }
            let duration = 0;
            let options = {
                title: "favorites playlist",
                fields: [],
            };
            // Returns an embed message displaying the playlist
            favPlaylist.forEach((song, i) => {
                if (limit <= i) return;

                duration += song.duration;

                let name = `${ i + 1 }) ${ song.title }`
                let desc = `${ UTIL.formatDuration(song.duration) } - [Open in browser](${ song.url })`

                options.fields.push({ title: name, description: desc });

                i ++;
            });
            options.description = `total duration: ${UTIL.formatDuration(duration)}`;

            this.embed(msg, options);
        }
    },
});

