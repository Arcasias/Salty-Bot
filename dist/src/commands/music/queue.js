"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
const DISPLAY_LIMIT = 25;
exports.default = new Command_1.default({
    name: "queue",
    keys: ["playlist", "q"],
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
    visibility: "public",
    async action({ msg, args }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (args[0] && list_1.remove.includes(args[0])) {
            if (!playlist.queue[0]) {
                throw new Exception_1.EmptyObject("queue");
            }
            if (!args[1]) {
                throw new Exception_1.MissingArg("song number");
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
                    throw new Exception_1.IncorrectValue("song", "number");
                }
                songId--;
                if (playlist.queue.length <= songId || songId < 0) {
                    throw new Exception_1.OutOfRange(songId);
                }
            }
            const removed = playlist.remove(...songs.map(Number));
            const message = Array.isArray(songs)
                ? `Songs n°${songs.map((s) => s + 1)} removed from the queue`
                : `Song n°${songs[0] + 1} - **${removed[0].title}** removed from the queue`;
            Salty_1.default.success(msg, message);
        }
        else if (args[0] && list_1.clear.includes(args[0])) {
            playlist.empty();
            Salty_1.default.success(msg, "queue cleared");
        }
        else {
            if (!playlist.queue[0]) {
                throw new Exception_1.EmptyObject("queue");
            }
            let totalDuration = 0;
            const options = {
                title: "current queue",
                fields: [],
                footer: { text: `repeat: ${playlist.repeat}` },
            };
            options.fields = playlist.queue
                .slice(0, DISPLAY_LIMIT)
                .map(({ duration, title, url }, i) => {
                const name = `${i + 1}) ${title}`;
                const description = `${utils_1.formatDuration(duration)} - [Open in browser](${url})`;
                totalDuration += duration;
                return {
                    name: playlist.pointer === i ? "> " + name : name,
                    value: description,
                };
            });
            options.description = `total duration: ${utils_1.formatDuration(totalDuration)}`;
            if (playlist.connection) {
                const playlistTitle = playlist.playing.title;
                const title = 20 < playlistTitle.length
                    ? playlistTitle.slice(0, 20) + "..."
                    : playlistTitle;
                options.description += ". Currently playing: " + title;
            }
            Salty_1.default.embed(msg, options);
        }
    },
});
