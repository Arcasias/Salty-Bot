"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const util_1 = require("util");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
const RESULT_LIMIT = 5;
const youtube = new googleapis_1.youtube_v3.Youtube({});
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const getInfo = util_1.promisify(ytdl_core_1.default.getInfo.bind(ytdl_core_1.default));
async function addSong(msg, playlist, songURL) {
    if (utils_1.generate(3)) {
        songURL = utils_1.choice(terms_1.surpriseSong);
    }
    const member = msg.member;
    const { length_seconds, title } = await getInfo(songURL);
    Salty_1.default.success(msg, `**${member.displayName}** added **${title}** to the queue`);
    msg.delete();
    playlist.add({
        duration: Number(length_seconds) * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(member.voice.channel);
    }
}
Command_1.default.register({
    name: "play",
    aliases: ["sing", "song", "video", "youtube", "yt"],
    category: "music",
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
            maxResults: RESULT_LIMIT,
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
        const numberReactions = utils_1.getNumberReactions(RESULT_LIMIT);
        const options = {
            actions: {
                reactions: numberReactions,
                onAdd({ emoji }, user, abort) {
                    if (user.id === msg.author.id) {
                        abort();
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
            messageUrls[numberReactions[index]] = videoURL;
        });
        Salty_1.default.embed(msg, options);
    },
});
