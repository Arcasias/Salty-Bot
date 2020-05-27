"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
const DISPLAY_LIMIT = 25;
Command_1.default.register({
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
    channel: "guild",
    async action({ args, msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (args[0] && terms_1.remove.includes(args[0])) {
            if (!playlist.queue[0]) {
                return Salty_1.default.warn(msg, "The queue is already empty.");
            }
            if (!args[1]) {
                return Salty_1.default.warn(msg, "You need to specify which song to remove.");
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
                    return Salty_1.default.warn(msg, "Specified song must be the index of a song in the queue.");
                }
                songId--;
                if (playlist.queue.length <= songId || songId < 0) {
                    return Salty_1.default.warn(msg, "Specified song number is out of the list indices.");
                }
            }
            const removed = playlist.remove(...songs.map(Number));
            const message = Array.isArray(songs)
                ? `Songs n°${songs.map((s) => s + 1)} removed from the queue`
                : `Song n°${songs[0] + 1} - **${removed[0].title}** removed from the queue`;
            Salty_1.default.success(msg, message);
        }
        else if (args[0] && terms_1.clear.includes(args[0])) {
            playlist.empty();
            Salty_1.default.success(msg, "queue cleared");
        }
        else {
            if (!playlist.queue.length) {
                return Salty_1.default.message(msg, "The queue is empty.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUN4Qyx1Q0FBNEM7QUFFNUMsdUNBQTZDO0FBRTdDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUV6QixpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztJQUN2QixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUNGLGdGQUFnRjtTQUN2RjtRQUNEO1lBQ0ksUUFBUSxFQUFFLGtEQUFrRDtZQUM1RCxNQUFNLEVBQ0YsaUZBQWlGO1NBQ3hGO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsT0FBTztZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1NBQzdCO0tBQ0o7SUFDRCxPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBRS9DLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BCLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQzthQUN6RDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsT0FB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