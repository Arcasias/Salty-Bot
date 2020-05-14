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
const terms_1 = require("../../terms");
const youtube = new googleapis_1.youtube_v3.Youtube({});
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const SYMBOLS = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
async function addSong(msg, playlist, songURL) {
    if (utils_1.generate(3)) {
        songURL = utils_1.choice(terms_1.surpriseSong);
    }
    const { length_seconds, title } = await new Promise((res, rej) => {
        ytdl_core_1.default.getInfo(songURL, (err, info) => {
            if (err) {
                rej(err);
            }
            res(info);
        });
    });
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
    async action({ args, msg }) {
        if (!msg.member.voice.channel) {
            throw new Exception_1.SaltyException("you're not in a voice channel");
        }
        const { playlist } = Guild_1.default.get(msg.guild.id);
        const addSongBound = addSong.bind(null, msg, playlist);
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
        const results = await new Promise((res, rej) => {
            youtube.search.list(generateQuery(args.join(" ")), (err, info) => {
                if (err) {
                    rej(err);
                }
                res(info);
            });
        });
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
            options.actions[SYMBOLS[i]] = addSong.bind(null, msg, playlist, searchResults[i]);
        });
        Salty_1.default.embed(msg, options);
    }
}
exports.default = PlayCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9wbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQXdDO0FBQ3hDLDBEQUE2QjtBQUM3QixvRUFBK0Q7QUFDL0QsdURBQXNFO0FBQ3RFLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQStDO0FBQy9DLHVDQUEyQztBQUkzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQVksRUFBRSxRQUFrQixFQUFFLE9BQWU7SUFDcEUsSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2IsT0FBTyxHQUFHLGNBQU0sQ0FBQyxvQkFBWSxDQUFDLENBQUM7S0FDbEM7SUFDRCxNQUFNLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDN0QsbUJBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2hDLElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNaO1lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUNILGVBQUssQ0FBQyxP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