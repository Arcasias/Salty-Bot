import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
export default new Command({
    name: "stop",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    visibility: "admin",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);
        if (playlist.connection) {
            playlist.stop();
            Salty.success(msg, choice(Salty.getList("answers")["bye"]), {
                react: "⏹",
            });
        }
        else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFckMsZUFBZSxJQUFJLE9BQU8sQ0FBQztJQUN2QixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxnREFBZ0Q7U0FDM0Q7S0FDSjtJQUNELFVBQVUsRUFBRSxPQUFPO0lBQ25CLE1BQU0sQ0FBQyxHQUFHO1FBQ04sTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDckIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hELEtBQUssRUFBRSxHQUFHO2FBQ2IsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7U0FDbEQ7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IEd1aWxkIGZyb20gXCIuLi8uLi9jbGFzc2VzL0d1aWxkXCI7XG5pbXBvcnQgU2FsdHkgZnJvbSBcIi4uLy4uL2NsYXNzZXMvU2FsdHlcIjtcbmltcG9ydCB7IGNob2ljZSB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29tbWFuZCh7XG4gICAgbmFtZTogXCJzdG9wXCIsXG4gICAga2V5czogW10sXG4gICAgaGVscDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogbnVsbCxcbiAgICAgICAgICAgIGVmZmVjdDogXCJMZWF2ZXMgdGhlIHZvaWNlIGNoYW5uZWwgYW5kIGRlbGV0ZXMgdGhlIHF1ZXVlXCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcImFkbWluXCIsXG4gICAgYWN0aW9uKG1zZykge1xuICAgICAgICBjb25zdCB7IHBsYXlsaXN0IH0gPSBHdWlsZC5nZXQobXNnLmd1aWxkLmlkKTtcblxuICAgICAgICBpZiAocGxheWxpc3QuY29ubmVjdGlvbikge1xuICAgICAgICAgICAgcGxheWxpc3Quc3RvcCgpO1xuICAgICAgICAgICAgU2FsdHkuc3VjY2Vzcyhtc2csIGNob2ljZShTYWx0eS5nZXRMaXN0KFwiYW5zd2Vyc1wiKVtcImJ5ZVwiXSksIHtcbiAgICAgICAgICAgICAgICByZWFjdDogXCLij7lcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgU2FsdHkuZXJyb3IobXNnLCBcIkknbSBub3QgaW4gYSB2b2ljZSBjaGFubmVsXCIpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIl19