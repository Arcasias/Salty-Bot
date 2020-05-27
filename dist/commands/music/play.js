"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
const youtube = new googleapis_1.youtube_v3.Youtube({});
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const SYMBOLS = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
async function addSong(msg, playlist, songURL) {
    if (utils_1.generate(3)) {
        songURL = utils_1.choice(terms_1.surpriseSong);
    }
    const member = msg.member;
    const { length_seconds, title } = await new Promise((res, rej) => {
        ytdl_core_1.default.getInfo(songURL, (err, info) => {
            if (err) {
                rej(err);
            }
            res(info);
        });
    });
    Salty_1.default.success(msg, `**${member.displayName}** added **${title}** to the queue`);
    msg.delete();
    playlist.add({
        duration: length_seconds * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(member.voice.channel);
    }
}
Command_1.default.register({
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
    channel: "guild",
    async action({ args, msg }) {
        var _a, _b;
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) {
            return Salty_1.default.warn(msg, "You're not in a voice channel.");
        }
        const { playlist } = Guild_1.default.get(msg.guild.id);
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (!playlist.queue[0]) {
                return Salty_1.default.warn(msg, "Can't play the queue if it's empty.");
            }
            if (playlist.connection) {
                return Salty_1.default.warn(msg, "I'm already playing.");
            }
            playlist.start(voiceChannel);
        }
        if (arg.match(youtubeRegex)) {
            return addSong(msg, playlist, arg);
        }
        const directPlay = ["first", "direct", "1"].includes(args[0]);
        if (directPlay) {
            args.shift();
        }
        const results = await youtube.search.list({
            key: process.env.GOOGLE_API,
            maxResults: 5,
            part: "snippet",
            q: args.join(" "),
            type: "video",
        });
        if (!((_b = (_a = results.data) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length)) {
            return Salty_1.default.warn(msg, "No results found.");
        }
        if (directPlay) {
            const firstValidSong = results.data.items.find((v) => v.id);
            if (firstValidSong) {
                return addSong(msg, playlist, youtubeURL + firstValidSong.id.videoId);
            }
        }
        const messageUrls = {};
        const options = {
            actions: {
                reactions: SYMBOLS,
                onAdd({ emoji }, user) {
                    if (user.id === msg.author.id) {
                        addSong(msg, playlist, messageUrls[emoji.name]);
                    }
                },
            },
            fields: [],
            title: "search results",
        };
        results.data.items.forEach(({ id, snippet }, index) => {
            if (!id) {
                return;
            }
            const videoURL = youtubeURL + id.videoId;
            const { title, channelTitle } = snippet;
            options.fields.push({
                name: `${index + 1}) ${title}`,
                value: `> From ${channelTitle}\n> [Open in browser](${videoURL})`,
            });
            messageUrls[SYMBOLS[index]] = videoURL;
        });
        Salty_1.default.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9wbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsMkNBQXdDO0FBQ3hDLDBEQUE2QjtBQUM3QixvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBRXhDLGdFQUF3QztBQUN4Qyx1Q0FBMkM7QUFFM0MsdUNBQStDO0FBRS9DLE1BQU0sT0FBTyxHQUFHLElBQUksdUJBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsTUFBTSxVQUFVLEdBQUcsa0NBQWtDLENBQUM7QUFDdEQsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRWpELE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRS9DLEtBQUssVUFBVSxPQUFPLENBQUMsR0FBWSxFQUFFLFFBQWtCLEVBQUUsT0FBZTtJQUNwRSxJQUFJLGdCQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDYixPQUFPLEdBQUcsY0FBTSxDQUFDLG9CQUFZLENBQUMsQ0FBQztLQUNsQztJQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUM7SUFDM0IsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzdELG1CQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNoQyxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDWjtZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FB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