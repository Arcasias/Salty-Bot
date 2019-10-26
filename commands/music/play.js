import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';
import google from 'googleapis';
import * as error from '../../classes/Exception.js';
import ytdl from 'ytdl-core';

const youtube = new google.youtube_v3.Youtube();
const youtubeURL = 'https://www.youtube.com/watch?v=';
const youtubeRegex = new RegExp(youtubeURL, 'i');

const SYMBOLS = ['1⃣', '2⃣', '3⃣' ,'4⃣' ,'5⃣'];

export default new Command({
    name: 'play',
    keys: [
        "sing",
        "song",
        "music",
        "video",
        "youtube",
        "yt",
    ],
    help: [
        {
            argument: null,
            effect: "Joins your current voice channel and plays the queue if it exists"
        },
        {
            argument: "***YouTube video URL***",
            effect: "Adds the provided video to the queue. I will automatically join your voice channel and play it if I'm not already busy in another channel"
        },
        {
            argument: "***key words***",
            effect: "Searches for a video on YouTube. You can then directly type the number of the video you want to be played"
        },
        {
            argument: "direct ***key words***",
            effect: "Searches for a video on YouTube and plays the first result"
        },
    ],
    visibility: 'public',
    action: function (msg, args) {
        if (! msg.member.voiceChannel) {
            throw new error.SaltyException("you're not in a voice channel");
        }
        const { playlist } = Guild.get(msg.guild.id);
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (! playlist.queue[0]) {
                throw new error.EmptyObject("queue");
            }
            if (! msg.guild.voiceConnection) {
                return msg.member.voiceChannel.join().then(connection => {
                    playlist.play(connection, true);
                });
            } else {
                throw new error.SaltyException("I'm already playing");
            }
        }
        if (['favorite', 'favorites', 'fav', 'favs'].includes(arg)) {
            return playFavorites.call(this);
        }
        let validURL = arg.match(youtubeRegex);
        let directPlay = ['first', 'direct', '1'].includes(args[0]);

        if (directPlay) args.shift();

        if (!validURL) {
            youtube.search.list({
                key: process.env.GOOGLE_API,
                maxResults: 5,
                part: 'snippet',
                q: args.join(" "),
                type: 'video',
            }, (err, results) => {
                if (err) {
                    return LOG.error(err);
                }
                let options = {
                    title: "search results",
                    fields: [],
                };
                let searchResults = [];

                if (results.data.items.length == 0) {
                    throw new error.SaltyException("no results found");
                }
                if (directPlay) {
                    const url = youtubeURL + results.data.items[0].id.videoId;
                    addSong.call(this, url, { msg });
                } else {
                    options.actions = {};
                    results.data.items.forEach((video, i) => {
                        let videoURL = youtubeURL + video.id.videoId;
                        searchResults.push(videoURL);
                        options.fields.push({
                            title: (i + 1) + ") " + video.snippet.title,
                            description: `> From ${video.snippet.channelTitle}\n> [Open in browser](${videoURL})`,
                        });
                        options.actions[SYMBOLS[i]] = addSong.bind(this, searchResults[i], { msg });
                    });
                    this.embed(msg, options);
                }
            });
        } else {
            addSong.call(this, arg, { msg });
        }
    },
});

function addSong(songURL, parameters) {
    let { msg, guild, channel } = parameters;
    if (msg) {
        guild = msg.guild;
        channel = msg.member.voiceChannel;
    }
    const playlist = Guild.get(guild.id).playlist;
    if (UTIL.generate(3)) {
        songURL = UTIL.choice(this.getList('surpriseSong'));
    }
    ytdl.getInfo(songURL, (err, info) => {
        if (err) {
            if (msg) this.embed(msg, { title: "that video doesn't exist", type: 'error' });
        } else {
            if (msg) {
                this.embed(msg, { title: `**${msg.member.displayName}** added **${info.title}** to the queue`, type: 'success' });
                msg.delete();
            }
            playlist.addSong(info.title, info.length_seconds * 1000, songURL);
            LOG.log(`Added song to the queue: ${info.title} at ${songURL}`);
            if (! guild.voiceConnection) {
                channel.join().then(connection => {
                    playlist.play(connection, true);
                });
            }
        }
    });
}

function playFavorites(data) {
    let { msg, guild, channel } = data;

    if (msg) {
        guild = msg.guild;
        channel = msg.member.voiceChannel;
        if (! Guild.get(guild.id).favS.Playlist[0]) {
            throw new error.EmptyObject("favorite playlist");
        }
        this.embed(msg, { title: `**${msg.member.displayName}** started the favorites playlist ! Rock on baby !`, type: 'success' });
    }
    const playlist = Guild.get(guild.id).playlist;
    UTIL.shuffle(Guild.get(guild.id).favS.Playlist).forEach(song => {
        playlist.addSong(song.title, song.duration - 0, song.url);
        LOG.log(`Added song to the queue: ${ song.title } at ${ song.url }`);

        playlist.repeat = 'all';

        if (! guild.voiceConnection) {
            channel.join().then(connection => {
                playlist.play(connection, true);
            });
        }
    });
}

