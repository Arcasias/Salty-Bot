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
    async action({ args, msg }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9wbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQXdDO0FBQ3hDLDBEQUE2QjtBQUM3QixvRUFBK0Q7QUFDL0QsdURBQXNFO0FBQ3RFLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQTBEO0FBQzFELHVDQUEyQztBQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUN6QyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDYixPQUFPLEdBQUcsY0FBTSxDQUFDLG9CQUFZLENBQUMsQ0FBQztLQUNsQztJQUNELE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxpQkFBUyxDQUM3QyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQUksRUFBRSxPQUFPLENBQUMsQ0FDbkMsQ0FBQztJQUNGLGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLGNBQWMsS0FBSyxpQkFBaUIsQ0FDbEUsQ0FBQztJQUNGLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNiLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYyxHQUFHLElBQUk7UUFDL0IsS0FBSyxFQUFFLEtBQUs7UUFDWixHQUFHLEVBQUUsT0FBTztLQUNmLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsQ0FBQztJQUNwQixPQUFPO1FBQ0gsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtRQUMzQixVQUFVLEVBQUUsQ0FBQztRQUNiLElBQUksRUFBRSxTQUFTO1FBQ2YsQ0FBQztRQUNELElBQUksRUFBRSxPQUFPO0tBQ2hCLENBQUM7QUFDTixDQUFDO0FBRUQsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQ0YsbUVBQW1FO2FBQzFFO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsTUFBTSxFQUNGLDJJQUEySTthQUNsSjtZQUNEO2dCQUNJLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLE1BQU0sRUFDRiwyR0FBMkc7YUFDbEg7WUFDRDtnQkFDSSxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxNQUFNLEVBQ0YsNERBQTREO2FBQ25FO1NBQ0osQ0FBQztJQTZETixDQUFDO0lBM0RHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQzNCLE1BQU0sSUFBSSwwQkFBYyxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDN0Q7UUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMvQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSx1QkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1lBQ0QsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO2dCQUNyQixNQUFNLElBQUksMEJBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN6QixPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUNELE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxVQUFVLEVBQUU7WUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEI7UUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFTLENBQzNCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDcEIsT0FBTyxDQUFDLE1BQU0sRUFDZCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNoQyxDQUNKLENBQUM7UUFFRixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLDBCQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUksVUFBVSxFQUFFO1lBQ1osT0FBTyxZQUFZLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0RTtRQUNELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN6QixNQUFNLE9BQU8sR0FBRztZQUNaLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLEVBQUU7WUFDVixLQUFLLEVBQUUsZ0JBQWdCO1NBQzFCLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQzdDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0JBQ3pDLFdBQVcsRUFBRSxVQUFVLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSx5QkFBeUIsUUFBUSxHQUFHO2FBQ3hGLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FDdEMsSUFBSSxFQUNKLEdBQUcsRUFDSCxRQUFRLEVBQ1IsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUNuQixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxXQUFXLENBQUMifQ==