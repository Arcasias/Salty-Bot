import google from "googleapis";
import ytdl from "ytdl-core";
import Command from "../../classes/Command";
import { EmptyObject, SaltyException } from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { choice, generate, promisify } from "../../utils";
const youtube = new google.youtube_v3.Youtube();
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const SYMBOLS = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
async function addSong(msg, playlist, songURL) {
    if (generate(3)) {
        songURL = choice(Salty.getList("surpriseSong"));
    }
    const { length_seconds, title } = await promisify(ytdl.getInfo.bind(ytdl, songURL));
    Salty.success(msg, `**${msg.member.displayName}** added **${title}** to the queue`);
    msg.delete();
    playlist.add({
        duration: length_seconds * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(msg.member.voiceChannel);
    }
}
function generateQuery(q) {
    return {
        key: process.env.GOOGLE_API,
        maxResults: 5,
        part: "snippet",
        q,
        type: "video",
    };
}
export default new Command({
    name: "play",
    keys: ["sing", "song", "video", "youtube", "yt"],
    help: [
        {
            argument: null,
            effect: "Joins your current voice channel and plays the queue if it exists",
        },
        {
            argument: "***YouTube video URL***",
            effect: "Adds the provided video to the queue. I will automatically join your voice channel and play it if I'm not already busy in another channel",
        },
        {
            argument: "***key words***",
            effect: "Searches for a video on YouTube. You can then directly type the number of the video you want to be played",
        },
        {
            argument: "direct ***key words***",
            effect: "Searches for a video on YouTube and plays the first result",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        if (!msg.member.voiceChannel) {
            throw new SaltyException("you're not in a voice channel");
        }
        const { playlist } = Guild.get(msg.guild.id);
        const addSongBound = addSong.bind(this, msg, playlist);
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (!playlist.queue[0]) {
                throw new EmptyObject("queue");
            }
            if (playlist.connection) {
                throw new SaltyException("I'm already playing");
            }
            playlist.start(msg.member.voiceChannel);
        }
        if (arg.match(youtubeRegex)) {
            return addSongBound(arg);
        }
        const directPlay = ["first", "direct", "1"].includes(args[0]);
        if (directPlay) {
            args.shift();
        }
        const results = await promisify(youtube.search.list.bind(youtube.search, generateQuery(args.join(" "))));
        if (results.data.items.length === 0) {
            throw new SaltyException("no results found");
        }
        if (directPlay) {
            return addSongBound(youtubeURL + results.data.items[0].id.videoId);
        }
        const searchResults = [];
        const options = {
            actions: {},
            fields: [],
            title: "search results",
        };
        results.data.items.forEach((video, i) => {
            let videoURL = youtubeURL + video.id.videoId;
            searchResults.push(videoURL);
            options.fields.push({
                title: i + 1 + ") " + video.snippet.title,
                description: `> From ${video.snippet.channelTitle}\n> [Open in browser](${videoURL})`,
            });
            options.actions[SYMBOLS[i]] = addSong.bind(this, msg, playlist, searchResults[i]);
        });
        Salty.embed(msg, options);
    },
});
