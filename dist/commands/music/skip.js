import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "skip",
    keys: ["next"],
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);
        if (playlist.connection) {
            playlist.skip();
            Salty.success(msg, `skipped **${playlist.getPlaying().title}**, but it was trash anyway`, { react: "⏩" });
        }
        else {
            Salty.error(msg, "I'm not connected to a voice channel");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9za2lwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBRXhDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDZCxJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLHdCQUF3QjtTQUNuQztLQUNKO0lBQ0QsVUFBVSxFQUFFLFFBQVE7SUFDcEIsTUFBTSxDQUFDLEdBQUc7UUFDTixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNyQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEIsS0FBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsYUFDSSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsS0FDMUIsNkJBQTZCLEVBQzdCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7U0FDNUQ7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IEd1aWxkIGZyb20gXCIuLi8uLi9jbGFzc2VzL0d1aWxkXCI7XG5pbXBvcnQgU2FsdHkgZnJvbSBcIi4uLy4uL2NsYXNzZXMvU2FsdHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwic2tpcFwiLFxuICAgIGtleXM6IFtcIm5leHRcIl0sXG4gICAgaGVscDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogbnVsbCxcbiAgICAgICAgICAgIGVmZmVjdDogXCJTa2lwcyB0byB0aGUgbmV4dCBzb25nXCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcInB1YmxpY1wiLFxuICAgIGFjdGlvbihtc2cpIHtcbiAgICAgICAgY29uc3QgeyBwbGF5bGlzdCB9ID0gR3VpbGQuZ2V0KG1zZy5ndWlsZC5pZCk7XG5cbiAgICAgICAgaWYgKHBsYXlsaXN0LmNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgIHBsYXlsaXN0LnNraXAoKTtcbiAgICAgICAgICAgIFNhbHR5LnN1Y2Nlc3MoXG4gICAgICAgICAgICAgICAgbXNnLFxuICAgICAgICAgICAgICAgIGBza2lwcGVkICoqJHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWxpc3QuZ2V0UGxheWluZygpLnRpdGxlXG4gICAgICAgICAgICAgICAgfSoqLCBidXQgaXQgd2FzIHRyYXNoIGFueXdheWAsXG4gICAgICAgICAgICAgICAgeyByZWFjdDogXCLij6lcIiB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgU2FsdHkuZXJyb3IobXNnLCBcIkknbSBub3QgY29ubmVjdGVkIHRvIGEgdm9pY2UgY2hhbm5lbFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdfQ==