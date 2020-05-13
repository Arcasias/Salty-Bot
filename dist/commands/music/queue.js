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
const terms_1 = require("../../terms");
const DISPLAY_LIMIT = 25;
class QueueCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "queue";
        this.keys = ["playlist", "q"];
        this.help = [
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
        ];
    }
    async action({ args, msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (args[0] && terms_1.remove.includes(args[0])) {
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
        else if (args[0] && terms_1.clear.includes(args[0])) {
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
    }
}
exports.default = QueueCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBK0Q7QUFDL0QsdURBS2lDO0FBQ2pDLGdFQUF3QztBQUN4QyxnRUFBMEQ7QUFDMUQsdUNBQTZDO0FBQzdDLHVDQUE0QztBQUU1QyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFFekIsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQ0YsZ0ZBQWdGO2FBQ3ZGO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGtEQUFrRDtnQkFDNUQsTUFBTSxFQUNGLGlGQUFpRjthQUN4RjtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsa0JBQWtCO2FBQzdCO1NBQ0osQ0FBQztJQWlGTixDQUFDO0lBL0VHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSx1QkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENB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