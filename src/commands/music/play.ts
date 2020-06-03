import { Message } from "discord.js";
import { youtube_v3 } from "googleapis";
import { promisify } from "util";
import ytdl, { videoInfo } from "ytdl-core";
import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Playlist from "../../classes/Playlist";
import Salty from "../../classes/Salty";
import { surpriseSong } from "../../terms";
import { Dictionnary, SaltyEmbedOptions } from "../../types";
import { choice, generate, getNumberReactions } from "../../utils";

const RESULT_LIMIT = 5;
const youtube = new youtube_v3.Youtube({});
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const getInfo = promisify(ytdl.getInfo.bind(ytdl));

async function addSong(msg: Message, playlist: Playlist, songURL: string) {
    if (generate(3)) {
        songURL = choice(surpriseSong);
    }
    const member = msg.member!;
    const { length_seconds, title } = <videoInfo>await getInfo(songURL);
    Salty.success(
        msg,
        `**${member.displayName}** added **${title}** to the queue`
    );
    msg.delete();
    playlist.add({
        duration: Number(length_seconds) * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(member.voice.channel!);
    }
}

Command.register({
    name: "play",
    aliases: ["sing", "song", "video", "youtube", "yt"],
    category: "music",
    help: [
        {
            argument: null,
            effect:
                "Joins your current voice channel and plays the queue if it exists",
        },
        {
            argument: "***YouTube video URL***",
            effect:
                "Adds the provided video to the queue. I will automatically join your voice channel and play it if I'm not already busy in another channel",
        },
        {
            argument: "***key words***",
            effect:
                "Searches for a video on YouTube. You can then directly type the number of the video you want to be played",
        },
        {
            argument: "direct ***key words***",
            effect:
                "Searches for a video on YouTube and plays the first result",
        },
    ],
    channel: "guild",

    async action({ args, msg }) {
        const voiceChannel = msg.member!.voice.channel;
        if (!voiceChannel) {
            return Salty.warn(msg, "You're not in a voice channel.");
        }
        const { playlist } = Guild.get(msg.guild!.id)!;
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (!playlist.queue[0]) {
                return Salty.warn(msg, "Can't play the queue if it's empty.");
            }
            if (playlist.connection) {
                return Salty.warn(msg, "I'm already playing.");
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
        if (!results.data?.items?.length) {
            return Salty.warn(msg, "No results found.");
        }
        if (directPlay) {
            const firstValidSong = results.data.items.find((v) => v.id);
            if (firstValidSong) {
                return addSong(
                    msg,
                    playlist,
                    youtubeURL + firstValidSong.id!.videoId
                );
            }
        }
        const messageUrls: Dictionnary<string> = {};
        const numberReactions = getNumberReactions(RESULT_LIMIT);
        const options: SaltyEmbedOptions = {
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
            const { title, channelTitle } = snippet!;
            options.fields!.push({
                name: `${index + 1}) ${title}`,
                value: `> From ${channelTitle}\n> [Open in browser](${videoURL})`,
            });
            messageUrls[numberReactions[index]] = videoURL;
        });
        Salty.embed(msg, options);
    },
});
