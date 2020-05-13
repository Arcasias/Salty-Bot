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
    }
}
exports.default = QueueCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsdURBS2lDO0FBQ2pDLGdFQUF3QztBQUN4QyxnRUFBMEQ7QUFDMUQsdUNBQTZDO0FBQzdDLHFDQUEyQztBQUUzQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFFekIsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQ0YsZ0ZBQWdGO2FBQ3ZGO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGtEQUFrRDtnQkFDNUQsTUFBTSxFQUNGLGlGQUFpRjthQUN4RjtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsa0JBQWtCO2FBQzdCO1NBQ0osQ0FBQztJQWlGTixDQUFDO0lBL0VHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0MsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLHVCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbEM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxzQkFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNoQjtZQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBR2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ2YsTUFBTSxJQUFJLDBCQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUM5QztnQkFDRCxNQUFNLEVBQUUsQ0FBQztnQkFDVCxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMvQyxNQUFNLElBQUksc0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDaEM7YUFDSjtZQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxXQUFXLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMseUJBQXlCO2dCQUM3RCxDQUFDLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FDZiwyQkFBMkIsQ0FBQztZQUVsQyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0MsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWpCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLHVCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbEM7WUFFRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7WUFDdEIsTUFBTSxPQUFPLEdBQWlCO2dCQUMxQixLQUFLLEVBQUUsZUFBZTtnQkFDdEIsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFO2FBQ2pELENBQUM7WUFDRixPQUFPLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLO2lCQUMxQixLQUFLLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQztpQkFDdkIsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sV0FBVyxHQUFHLEdBQUcsc0JBQWMsQ0FDakMsUUFBUSxDQUNYLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztnQkFDaEMsYUFBYSxJQUFJLFFBQVEsQ0FBQztnQkFDMUIsT0FBTztvQkFDSCxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUk7b0JBQ2pELEtBQUssRUFBRSxXQUFXO2lCQUNyQixDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFDUCxPQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFtQixzQkFBYyxDQUNuRCxhQUFhLENBQ2hCLEVBQUUsQ0FBQztZQUNKLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtnQkFDckIsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLE1BQU0sS0FBSyxHQUNQLEVBQUUsR0FBRyxhQUFhLENBQUMsTUFBTTtvQkFDckIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUs7b0JBQ3BDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxXQUFXLElBQUksdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2FBQzFEO1lBQ0QsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0I7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==