"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
const DISPLAY_LIMIT = 25;
Command_1.default.register({
    name: "queue",
    aliases: ["playlist", "q"],
    category: "music",
    help: [
        {
            argument: null,
            effect: "Shows the current queue. To add something to it, refer to the **play** command",
        },
        {
            argument: "remove ***song number***, ***song number***, ...",
            effect: 'Deletes one or several songs from the queue. Numbers must be separated with ","',
        },
        {
            argument: "clear",
            effect: "Clears the queue",
        },
    ],
    channel: "guild",
    async action({ args, msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        switch (utils_1.meaning(args[0])) {
            case "remove": {
                if (!playlist.queue[0]) {
                    return salty_1.default.warn(msg, "The queue is already empty.");
                }
                if (!args[1]) {
                    return salty_1.default.warn(msg, "You need to specify which song to remove.");
                }
                else {
                    args.shift();
                }
                const songs = args.join("").split(",");
                const songIds = Array.isArray(songs)
                    ? [...new Set(...songs)]
                    : [songs];
                for (let i = 0; i < songIds.length; i++) {
                    let songId = Number(songIds[i]);
                    if (isNaN(songId)) {
                        return salty_1.default.warn(msg, "Specified song must be the index of a song in the queue.");
                    }
                    songId--;
                    if (playlist.queue.length <= songId || songId < 0) {
                        return salty_1.default.warn(msg, "Specified song number is out of the list indices.");
                    }
                }
                const removed = playlist.remove(...songs.map(Number));
                const message = Array.isArray(songs)
                    ? `Songs n°${songs.map((s) => s + 1)} removed from the queue`
                    : `Song n°${songs[0] + 1} - **${removed[0].title}** removed from the queue`;
                return salty_1.default.success(msg, message);
            }
            case "clear": {
                playlist.empty();
                return salty_1.default.success(msg, "queue cleared");
            }
            default: {
                if (!playlist.queue.length) {
                    return salty_1.default.info(msg, "The queue is empty.");
                }
                let totalDuration = 0;
                const options = {
                    title: "Current queue",
                    fields: [],
                    footer: { text: `repeat: ${playlist.repeat}` },
                };
                options.fields = playlist.queue
                    .slice(0, DISPLAY_LIMIT)
                    .map(({ channel, duration, title, url }, i) => {
                    let name = `${channel} - ${utils_1.formatDuration(duration)}`;
                    const value = `${i + 1}) [${title}](${url})`;
                    if (playlist.pointer === i) {
                        name = `➤ ${name} (playing)`;
                    }
                    totalDuration += duration;
                    return { name, value };
                });
                options.description = `total duration: ${utils_1.formatDuration(totalDuration)}`;
                if (playlist.connection) {
                    const playlistTitle = playlist.playing.title;
                    const title = 20 < playlistTitle.length
                        ? playlistTitle.slice(0, 20) + "..."
                        : playlistTitle;
                    options.title = "Currently playing: " + title;
                }
                return salty_1.default.embed(msg, options);
            }
        }
    },
});
