import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
export default new Command({
    name: "disconnect",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Disconnects me and terminates my program. Think wisely before using this one, ok ?",
        },
    ],
    visibility: "dev",
    async action() {
        await Salty.success(`${choice(Salty.getList("answers")["bye"])} ♥`);
        await Salty.destroy();
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvZGlzY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXJDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUNGLG9GQUFvRjtTQUMzRjtLQUNKO0lBQ0QsVUFBVSxFQUFFLEtBQUs7SUFDakIsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRSxNQUFNLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5pbXBvcnQgeyBjaG9pY2UgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwiZGlzY29ubmVjdFwiLFxuICAgIGtleXM6IFtdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6XG4gICAgICAgICAgICAgICAgXCJEaXNjb25uZWN0cyBtZSBhbmQgdGVybWluYXRlcyBteSBwcm9ncmFtLiBUaGluayB3aXNlbHkgYmVmb3JlIHVzaW5nIHRoaXMgb25lLCBvayA/XCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcImRldlwiLFxuICAgIGFzeW5jIGFjdGlvbigpIHtcbiAgICAgICAgYXdhaXQgU2FsdHkuc3VjY2VzcyhgJHtjaG9pY2UoU2FsdHkuZ2V0TGlzdChcImFuc3dlcnNcIilbXCJieWVcIl0pfSDimaVgKTtcbiAgICAgICAgYXdhaXQgU2FsdHkuZGVzdHJveSgpO1xuICAgIH0sXG59KTtcbiJdfQ==