'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const google = require('googleapis');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const ytdl = require('ytdl-core');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API,
});
const youtubeURL = 'https://www.youtube.com/watch?v=';
const youtubeRegex = new RegExp('https://www.youtube.com/watch', 'i');

module.exports = new Command({
    name: 'play',
    keys: [
        "play",
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
    // TODO: REMOVE -> there seems to be a problem with the ytdl library. Check this issue to see if it's resolved and remove mode on this command once it's fixed.
    // https://github.com/discordjs/discord.js/issues/3314
    mode: 'none',
    visibility: 'public', 
    action: function (msg, args) {

        if (! msg.member.voiceChannel) {
            throw new error.SaltyException("you're not in a voice channel");
        }
        let { playlist } = Guild.get(msg.guild.id);
        let arg = Array.isArray(args) ? args[0] : args;
        if (! arg) {
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
        if ("test" === arg) {
            arg = S.config.testSong;
        }
        if (['favorite', 'favorites', 'fav', 'favs'].includes(arg)) {
            return playFavorites();
        }
        let validURL = arg.match(youtubeRegex);
        let directPlay = ['first', 'direct', '1'].includes(args[0]);

        if (directPlay) args.shift();

        if (! validURL) {
            youtube.search.list({
                type: 'video',
                part: 'snippet',
                q: args.join(" "),
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
                results.data.items.forEach((video, i) => {
                    let videoURL = youtubeURL + video.id.videoId;
                    searchResults.push(videoURL);
                    options.fields.push({
                        title: (i + 1) + ") " + video.snippet.title,
                        description: `> [Open in browser](${ videoURL }) - From ${ video.snippet.channelTitle }`,
                    });
                });
                if (! directPlay) {
                    options.actions = {
                        '1⃣': null,
                        '2⃣': null,
                        '3⃣': null,
                        '4⃣': null,
                        '5⃣': null,
                    };
                    for (let i = 0; i < 5; i ++) {
                        options.actions[Object.keys(options.actions)[i]] = S.commands.list.get('play').run.bind(this, msg, searchResults[i]);
                    }
                    S.embed(msg, options);
                } else {
                    addSong(searchResults[Object.keys(searchResults)[0]], { msg: msg });
                }
            });
        } else {
            addSong(arg, { msg: msg });
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
        songURL = UTIL.choice(S.getList('surpriseSong'));
    }
    ytdl.getInfo(songURL, (err, info) => {
        if (err) {
            if (msg) S.embed(msg, { title: "that video doesn't exist", type: 'error' });
        } else {
            if (msg) {
                S.embed(msg, { title: `**${msg.member.displayName}** added **${info.title}** to the queue`, type: 'success' });
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
        S.embed(msg, { title: `**${msg.member.displayName}** started the favorites playlist ! Rock on baby !`, type: 'success' });
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

