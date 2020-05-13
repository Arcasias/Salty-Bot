import Command, { CommandParams } from "../../classes/Command";
import {
    EmptyObject,
    IncorrectValue,
    MissingArg,
    OutOfRange,
} from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty, { EmbedOptions } from "../../classes/Salty";
import { formatDuration } from "../../utils";
import { clear, remove } from "../../terms";

const DISPLAY_LIMIT = 25;

class QueueCommand extends Command {
    public name = "queue";
    public keys = ["playlist", "q"];
    public help = [
        {
            argument: null,
            effect:
                "Shows the current queue. To add something to it, refer to the **play** command",
        },
        {
            argument: "remove ***song number***, ***song number***, ...",
            effect:
                'Deletes one or several songs from the queue. Numbers must be separated with ","',
        },
        {
            argument: "clear",
            effect: "Clears the queue",
        },
    ];

    async action({ args, msg }: CommandParams) {
        const { playlist } = Guild.get(msg.guild.id);

        if (args[0] && remove.includes(args[0])) {
            if (!playlist.queue[0]) {
                throw new EmptyObject("queue");
            }
            if (!args[1]) {
                throw new MissingArg("song number");
            } else {
                args.shift();
            }
            const songs = args.join("").split(",");
            const songIds = Array.isArray(songs)
                ? [...new Set(...songs)]
                : [songs];

            // Checks for validity
            for (let i = 0; i < songIds.length; i++) {
                let songId = Number(songIds[i]);
                if (isNaN(songId)) {
                    throw new IncorrectValue("song", "number");
                }
                songId--; // converting logical index to array index
                if (playlist.queue.length <= songId || songId < 0) {
                    throw new OutOfRange(songId);
                }
            }

            const removed = playlist.remove(...songs.map(Number));
            const message = Array.isArray(songs)
                ? `Songs n°${songs.map((s) => s + 1)} removed from the queue`
                : `Song n°${songs[0] + 1} - **${
                      removed[0].title
                  }** removed from the queue`;

            Salty.success(msg, message);
        } else if (args[0] && clear.includes(args[0])) {
            playlist.empty();

            Salty.success(msg, "queue cleared");
        } else {
            if (!playlist.queue[0]) {
                throw new EmptyObject("queue");
            }
            // Returns an embed message displaying all songs
            let totalDuration = 0;
            const options: EmbedOptions = {
                title: "current queue",
                fields: [],
                footer: { text: `repeat: ${playlist.repeat}` },
            };
            options.fields = playlist.queue
                .slice(0, DISPLAY_LIMIT)
                .map(({ duration, title, url }, i) => {
                    const name = `${i + 1}) ${title}`;
                    const description = `${formatDuration(
                        duration
                    )} - [Open in browser](${url})`;
                    totalDuration += duration;
                    return {
                        name: playlist.pointer === i ? "> " + name : name,
                        value: description,
                    };
                });
            options.description = `total duration: ${formatDuration(
                totalDuration
            )}`;
            if (playlist.connection) {
                const playlistTitle = playlist.playing.title;
                const title =
                    20 < playlistTitle.length
                        ? playlistTitle.slice(0, 20) + "..."
                        : playlistTitle;
                options.description += ". Currently playing: " + title;
            }
            Salty.embed(msg, options);
        }
    }
}

export default QueueCommand;
