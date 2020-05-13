"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
const youtube = new googleapis_1.youtube_v3.Youtube({});
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const SYMBOLS = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
async function addSong(msg, playlist, songURL) {
    if (utils_1.generate(3)) {
        songURL = utils_1.choice(list_1.surpriseSong);
    }
    const { length_seconds, title } = await utils_1.promisify(ytdl_core_1.default.getInfo.bind(ytdl_core_1.default, songURL));
    Salty_1.default.success(msg, `**${msg.member.displayName}** added **${title}** to the queue`);
    msg.delete();
    playlist.add({
        duration: length_seconds * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(msg.member.voice.channel);
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
class PlayCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "play";
        this.keys = ["sing", "song", "video", "youtube", "yt"];
        this.help = [
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
        ];
    }
    async action({ msg, args }) {
        if (!msg.member.voice.channel) {
            throw new Exception_1.SaltyException("you're not in a voice channel");
        }
        const { playlist } = Guild_1.default.get(msg.guild.id);
        const addSongBound = addSong.bind(this, msg, playlist);
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (!playlist.queue[0]) {
                throw new Exception_1.EmptyObject("queue");
            }
            if (playlist.connection) {
                throw new Exception_1.SaltyException("I'm already playing");
            }
            playlist.start(msg.member.voice.channel);
        }
        if (arg.match(youtubeRegex)) {
            return addSongBound(arg);
        }
        const directPlay = ["first", "direct", "1"].includes(args[0]);
        if (directPlay) {
            args.shift();
        }
        const results = await utils_1.promisify(youtube.search.list.bind(youtube.search, generateQuery(args.join(" "))));
        if (results.data.items.length === 0) {
            throw new Exception_1.SaltyException("no results found");
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
        Salty_1.default.embed(msg, options);
    }
}
exports.default = PlayCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9wbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQXdDO0FBQ3hDLDBEQUE2QjtBQUM3QixvRUFBNEM7QUFDNUMsdURBQXNFO0FBQ3RFLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQTBEO0FBQzFELHFDQUEwQztBQUUxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUN6QyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDYixPQUFPLEdBQUcsY0FBTSxDQUFDLG1CQUFZLENBQUMsQ0FBQztLQUNsQztJQUNELE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxpQkFBUyxDQUM3QyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQUksRUFBRSxPQUFPLENBQUMsQ0FDbkMsQ0FBQztJQUNGLGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLGNBQWMsS0FBSyxpQkFBaUIsQ0FDbEUsQ0FBQztJQUNGLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNiLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYyxHQUFHLElBQUk7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