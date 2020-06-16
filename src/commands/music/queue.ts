import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { SaltyEmbedOptions } from "../../types";
import { formatDuration, meaning } from "../../utils";

const DISPLAY_LIMIT = 25;

Command.register({
    name: "queue",
    aliases: ["playlist", "q"],
    category: "music",
    help: [
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
    ],
    channel: "guild",

    async action({ args, msg }) {
        const { playlist } = Guild.get(msg.guild!.id)!;

        switch (meaning(args[0])) {
            case "remove": {
                if (!playlist.queue[0]) {
                    return Salty.warn(msg, "The queue is already empty.");
                }
                if (!args[1]) {
                    return Salty.warn(
                        msg,
                        "You need to specify which song to remove."
                    );
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
                        return Salty.warn(
                            msg,
                            "Specified song must be the index of a song in the queue."
                        );
                    }
                    songId--; // converting logical index to array index
                    if (playlist.queue.length <= songId || songId < 0) {
                        return Salty.warn(
                            msg,
                            "Specified song number is out of the list indices."
                        );
                    }
                }

                const removed = playlist.remove(...songs.map(Number));
                const message = Array.isArray(songs)
                    ? `Songs n°${songs.map(
                          (s) => s + 1
                      )} removed from the queue`
                    : `Song n°${songs[0] + 1} - **${
                          removed[0].title
                      }** removed from the queue`;

                return Salty.success(msg, message);
            }
            case "clear": {
                playlist.empty();
                return Salty.success(msg, "queue cleared");
            }
            default: {
                if (!playlist.queue.length) {
                    return Salty.info(msg, "The queue is empty.");
                }
                // Returns an embed message displaying all songs
                let totalDuration = 0;
                const options: SaltyEmbedOptions = {
                    title: "Current queue",
                    fields: [],
                    footer: { text: `repeat: ${playlist.repeat}` },
                };
                options.fields = playlist.queue
                    .slice(0, DISPLAY_LIMIT)
                    .map(({ channel, duration, title, url }, i) => {
                        let name = `${channel} - ${formatDuration(duration)}`;
                        const value = `${i + 1}) [${title}](${url})`;
                        if (playlist.pointer === i) {
                            name = `➤ ${name} (playing)`;
                        }
                        totalDuration += duration;
                        return { name, value };
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
                    options.title = "Currently playing: " + title;
                }
                return Salty.embed(msg, options);
            }
        }
    },
});
