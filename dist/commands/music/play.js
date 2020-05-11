import google from "googleapis";
import ytdl from "ytdl-core";
import Command from "../../classes/Command";
import { EmptyObject, SaltyException } from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { choice, generate, promisify } from "../../utils";
const youtube = new google.youtube_v3.Youtube();
const youtubeURL = "https://www.youtube.com/watch?v=";
const youtubeRegex = new RegExp(youtubeURL, "i");
const SYMBOLS = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
async function addSong(msg, playlist, songURL) {
    if (generate(3)) {
        songURL = choice(Salty.getList("surpriseSong"));
    }
    const { length_seconds, title } = await promisify(ytdl.getInfo.bind(ytdl, songURL));
    Salty.success(msg, `**${msg.member.displayName}** added **${title}** to the queue`);
    msg.delete();
    playlist.add({
        duration: length_seconds * 1000,
        title: title,
        url: songURL,
    });
    if (!playlist.connection) {
        playlist.start(msg.member.voiceChannel);
    }
}
function generateQuery(q) {
    return {
        key: process.env.GOOGLE_API,
        maxResults: 5,
        part: "snippet",
        q,
        type: "video",
    };
}
export default new Command({
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
    visibility: "public",
    async action(msg, args) {
        if (!msg.member.voiceChannel) {
            throw new SaltyException("you're not in a voice channel");
        }
        const { playlist } = Guild.get(msg.guild.id);
        const addSongBound = addSong.bind(this, msg, playlist);
        let arg = Array.isArray(args) ? args[0] : args;
        if (!arg) {
            if (!playlist.queue[0]) {
                throw new EmptyObject("queue");
            }
            if (playlist.connection) {
                throw new SaltyException("I'm already playing");
            }
            playlist.start(msg.member.voiceChannel);
        }
        if (arg.match(youtubeRegex)) {
            return addSongBound(arg);
        }
        const directPlay = ["first", "direct", "1"].includes(args[0]);
        if (directPlay) {
            args.shift();
        }
        const results = await promisify(youtube.search.list.bind(youtube.search, generateQuery(args.join(" "))));
        if (results.data.items.length === 0) {
            throw new SaltyException("no results found");
        }
        if (directPlay) {
            return addSongBound(youtubeURL + results.data.items[0].id.videoId);
        }
        const searchResults = [];
        const options = {
            actions: {},
            fields: [],
            title: "search results",
        };
        results.data.items.forEach((video, i) => {
            let videoURL = youtubeURL + video.id.videoId;
            searchResults.push(videoURL);
            options.fields.push({
                title: i + 1 + ") " + video.snippet.title,
                description: `> From ${video.snippet.channelTitle}\n> [Open in browser](${videoURL})`,
            });
            options.actions[SYMBOLS[i]] = addSong.bind(this, msg, playlist, searchResults[i]);
        });
        Salty.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9wbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLFlBQVksQ0FBQztBQUNoQyxPQUFPLElBQUksTUFBTSxXQUFXLENBQUM7QUFDN0IsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RSxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFMUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hELE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUN6QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0tBQ25EO0lBQ0QsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLFNBQVMsQ0FDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUNuQyxD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WUFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ3RDLElBQUksRUFDSixHQUFHLEVBQ0gsUUFBUSxFQUNSLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FDbkIsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnb29nbGUgZnJvbSBcImdvb2dsZWFwaXNcIjtcbmltcG9ydCB5dGRsIGZyb20gXCJ5dGRsLWNvcmVcIjtcbmltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCB7IEVtcHR5T2JqZWN0LCBTYWx0eUV4Y2VwdGlvbiB9IGZyb20gXCIuLi8uLi9jbGFzc2VzL0V4Y2VwdGlvblwiO1xuaW1wb3J0IEd1aWxkIGZyb20gXCIuLi8uLi9jbGFzc2VzL0d1aWxkXCI7XG5pbXBvcnQgU2FsdHkgZnJvbSBcIi4uLy4uL2NsYXNzZXMvU2FsdHlcIjtcbmltcG9ydCB7IGNob2ljZSwgZ2VuZXJhdGUsIHByb21pc2lmeSB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG5jb25zdCB5b3V0dWJlID0gbmV3IGdvb2dsZS55b3V0dWJlX3YzLllvdXR1YmUoKTtcbmNvbnN0IHlvdXR1YmVVUkwgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9XCI7XG5jb25zdCB5b3V0dWJlUmVnZXggPSBuZXcgUmVnRXhwKHlvdXR1YmVVUkwsIFwiaVwiKTtcblxuY29uc3QgU1lNQk9MUyA9IFtcIjHig6NcIiwgXCIy4oOjXCIsIFwiM+KDo1wiLCBcIjTig6NcIiwgXCI14oOjXCJdO1xuXG5hc3luYyBmdW5jdGlvbiBhZGRTb25nKG1zZywgcGxheWxpc3QsIHNvbmdVUkwpIHtcbiAgICBpZiAoZ2VuZXJhdGUoMykpIHtcbiAgICAgICAgc29uZ1VSTCA9IGNob2ljZShTYWx0eS5nZXRMaXN0KFwic3VycHJpc2VTb25nXCIpKTtcbiAgICB9XG4gICAgY29uc3QgeyBsZW5ndGhfc2Vjb25kcywgdGl0bGUgfSA9IGF3YWl0IHByb21pc2lmeShcbiAgICAgICAgeXRkbC5nZXRJbmZvLmJpbmQoeXRkbCwgc29uZ1VSTClcbiAgICApO1xuICAgIFNhbHR5LnN1Y2Nlc3MoXG4gICAgICAgIG1zZyxcbiAgICAgICAgYCoqJHttc2cubWVtYmVyLmRpc3BsYXlOYW1lfSoqIGFkZGVkICoqJHt0aXRsZX0qKiB0byB0aGUgcXVldWVgXG4gICAgKTtcbiAgICBtc2cuZGVsZXRlKCk7XG4gICAgcGxheWxpc3QuYWRkKHtcbiAgICAgICAgZHVyYXRpb246IGxlbmd0aF9zZWNvbmRzICogMTAwMCxcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICB1cmw6IHNvbmdVUkwsXG4gICAgfSk7XG4gICAgaWYgKCFwbGF5bGlzdC5jb25uZWN0aW9uKSB7XG4gICAgICAgIHBsYXlsaXN0LnN0YXJ0KG1zZy5tZW1iZXIudm9pY2VDaGFubmVsKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUXVlcnkocSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogcHJvY2Vzcy5lbnYuR09PR0xFX0FQSSxcbiAgICAgICAgbWF4UmVzdWx0czogNSxcbiAgICAgICAgcGFydDogXCJzbmlwcGV0XCIsXG4gICAgICAgIHEsXG4gICAgICAgIHR5cGU6IFwidmlkZW9cIixcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29tbWFuZCh7XG4gICAgbmFtZTogXCJwbGF5XCIsXG4gICAga2V5czogW1wic2luZ1wiLCBcInNvbmdcIiwgXCJ2aWRlb1wiLCBcInlvdXR1YmVcIiwgXCJ5dFwiXSxcbiAgICBoZWxwOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBudWxsLFxuICAgICAgICAgICAgZWZmZWN0OlxuICAgICAgICAgICAgICAgIFwiSm9pbnMgeW91ciBjdXJyZW50IHZvaWNlIGNoYW5uZWwgYW5kIHBsYXlzIHRoZSBxdWV1ZSBpZiBpdCBleGlzdHNcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IFwiKioqWW91VHViZSB2aWRlbyBVUkwqKipcIixcbiAgICAgICAgICAgIGVmZmVjdDpcbiAgICAgICAgICAgICAgICBcIkFkZHMgdGhlIHByb3ZpZGVkIHZpZGVvIHRvIHRoZSBxdWV1ZS4gSSB3aWxsIGF1dG9tYXRpY2FsbHkgam9pbiB5b3VyIHZvaWNlIGNoYW5uZWwgYW5kIHBsYXkgaXQgaWYgSSdtIG5vdCBhbHJlYWR5IGJ1c3kgaW4gYW5vdGhlciBjaGFubmVsXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBcIioqKmtleSB3b3JkcyoqKlwiLFxuICAgICAgICAgICAgZWZmZWN0OlxuICAgICAgICAgICAgICAgIFwiU2VhcmNoZXMgZm9yIGEgdmlkZW8gb24gWW91VHViZS4gWW91IGNhbiB0aGVuIGRpcmVjdGx5IHR5cGUgdGhlIG51bWJlciBvZiB0aGUgdmlkZW8geW91IHdhbnQgdG8gYmUgcGxheWVkXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBcImRpcmVjdCAqKiprZXkgd29yZHMqKipcIixcbiAgICAgICAgICAgIGVmZmVjdDpcbiAgICAgICAgICAgICAgICBcIlNlYXJjaGVzIGZvciBhIHZpZGVvIG9uIFlvdVR1YmUgYW5kIHBsYXlzIHRoZSBmaXJzdCByZXN1bHRcIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgYXN5bmMgYWN0aW9uKG1zZywgYXJncykge1xuICAgICAgICBpZiAoIW1zZy5tZW1iZXIudm9pY2VDaGFubmVsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU2FsdHlFeGNlcHRpb24oXCJ5b3UncmUgbm90IGluIGEgdm9pY2UgY2hhbm5lbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHBsYXlsaXN0IH0gPSBHdWlsZC5nZXQobXNnLmd1aWxkLmlkKTtcbiAgICAgICAgY29uc3QgYWRkU29uZ0JvdW5kID0gYWRkU29uZy5iaW5kKHRoaXMsIG1zZywgcGxheWxpc3QpO1xuICAgICAgICBsZXQgYXJnID0gQXJyYXkuaXNBcnJheShhcmdzKSA/IGFyZ3NbMF0gOiBhcmdzO1xuICAgICAgICBpZiAoIWFyZykge1xuICAgICAgICAgICAgaWYgKCFwbGF5bGlzdC5xdWV1ZVswXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFbXB0eU9iamVjdChcInF1ZXVlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBsYXlsaXN0LmNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU2FsdHlFeGNlcHRpb24oXCJJJ20gYWxyZWFkeSBwbGF5aW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWxpc3Quc3RhcnQobXNnLm1lbWJlci52b2ljZUNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcubWF0Y2goeW91dHViZVJlZ2V4KSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZFNvbmdCb3VuZChhcmcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpcmVjdFBsYXkgPSBbXCJmaXJzdFwiLCBcImRpcmVjdFwiLCBcIjFcIl0uaW5jbHVkZXMoYXJnc1swXSk7XG4gICAgICAgIGlmIChkaXJlY3RQbGF5KSB7XG4gICAgICAgICAgICBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcHJvbWlzaWZ5KFxuICAgICAgICAgICAgeW91dHViZS5zZWFyY2gubGlzdC5iaW5kKFxuICAgICAgICAgICAgICAgIHlvdXR1YmUuc2VhcmNoLFxuICAgICAgICAgICAgICAgIGdlbmVyYXRlUXVlcnkoYXJncy5qb2luKFwiIFwiKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAocmVzdWx0cy5kYXRhLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFNhbHR5RXhjZXB0aW9uKFwibm8gcmVzdWx0cyBmb3VuZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0UGxheSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZFNvbmdCb3VuZCh5b3V0dWJlVVJMICsgcmVzdWx0cy5kYXRhLml0ZW1zWzBdLmlkLnZpZGVvSWQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFjdGlvbnM6IHt9LFxuICAgICAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgICAgIHRpdGxlOiBcInNlYXJjaCByZXN1bHRzXCIsXG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdHMuZGF0YS5pdGVtcy5mb3JFYWNoKCh2aWRlbywgaSkgPT4ge1xuICAgICAgICAgICAgbGV0IHZpZGVvVVJMID0geW91dHViZVVSTCArIHZpZGVvLmlkLnZpZGVvSWQ7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzLnB1c2godmlkZW9VUkwpO1xuICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGkgKyAxICsgXCIpIFwiICsgdmlkZW8uc25pcHBldC50aXRsZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYD4gRnJvbSAke3ZpZGVvLnNuaXBwZXQuY2hhbm5lbFRpdGxlfVxcbj4gW09wZW4gaW4gYnJvd3Nlcl0oJHt2aWRlb1VSTH0pYCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zW1NZTUJPTFNbaV1dID0gYWRkU29uZy5iaW5kKFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgbXNnLFxuICAgICAgICAgICAgICAgIHBsYXlsaXN0LFxuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNbaV1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICBTYWx0eS5lbWJlZChtc2csIG9wdGlvbnMpO1xuICAgIH0sXG59KTtcbiJdfQ==