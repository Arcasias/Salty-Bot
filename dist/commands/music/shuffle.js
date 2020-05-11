import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "shuffle",
    keys: ["mix"],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);
        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty.success(msg, "queue shuffled !", { react: "🔀" });
        }
        else {
            Salty.error(msg, "don't you think you'd need more than 1 song to make it useful ?");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1ZmZsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zaHVmZmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBRXhDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDYixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLG9CQUFvQjtTQUMvQjtLQUNKO0lBQ0QsVUFBVSxFQUFFLFFBQVE7SUFDcEIsTUFBTSxDQUFDLEdBQUc7UUFDTixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO2FBQU07WUFDSCxLQUFLLENBQUMsS0FBSyxDQUNQLEdBQUcsRUFDSCxpRUFBaUUsQ0FDcEUsQ0FBQztTQUNMO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCBHdWlsZCBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9HdWlsZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcInNodWZmbGVcIixcbiAgICBrZXlzOiBbXCJtaXhcIl0sXG4gICAgaGVscDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogbnVsbCxcbiAgICAgICAgICAgIGVmZmVjdDogXCJTaHVmZmxlcyB0aGUgcXVldWVcIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgYWN0aW9uKG1zZykge1xuICAgICAgICBjb25zdCB7IHBsYXlsaXN0IH0gPSBHdWlsZC5nZXQobXNnLmd1aWxkLmlkKTtcblxuICAgICAgICBpZiAocGxheWxpc3QucXVldWUubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgcGxheWxpc3Quc2h1ZmZsZSgpO1xuICAgICAgICAgICAgU2FsdHkuc3VjY2Vzcyhtc2csIFwicXVldWUgc2h1ZmZsZWQgIVwiLCB7IHJlYWN0OiBcIvCflIBcIiB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFNhbHR5LmVycm9yKFxuICAgICAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgICAgICBcImRvbid0IHlvdSB0aGluayB5b3UnZCBuZWVkIG1vcmUgdGhhbiAxIHNvbmcgdG8gbWFrZSBpdCB1c2VmdWwgP1wiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIl19