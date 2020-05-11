import Command from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
export default new Command({
    name: "choose",
    keys: ["choice", "chose", "shoes"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok ?",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        if (!args[0] || !args[1]) {
            throw new MissingArg("choices");
        }
        await Salty.message(msg, `I choose ${choice(args.join(" ").split("/"))}`);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY2hvb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXJDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUNsQyxJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0ksUUFBUSxFQUFFLGdEQUFnRDtZQUMxRCxNQUFNLEVBQ0YsZ0tBQWdLO1NBQ3ZLO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuQztRQUNELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUNsRCxDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCB7IE1pc3NpbmdBcmcgfSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9FeGNlcHRpb25cIjtcbmltcG9ydCBTYWx0eSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9TYWx0eVwiO1xuaW1wb3J0IHsgY2hvaWNlIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcImNob29zZVwiLFxuICAgIGtleXM6IFtcImNob2ljZVwiLCBcImNob3NlXCIsIFwic2hvZXNcIl0sXG4gICAgaGVscDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogbnVsbCxcbiAgICAgICAgICAgIGVmZmVjdDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IFwiKioqZmlyc3QgY2hvaWNlKioqIC8gKioqc2Vjb25kIGNob2ljZSoqKiAvIC4uLlwiLFxuICAgICAgICAgICAgZWZmZWN0OlxuICAgICAgICAgICAgICAgIFwiQ2hvb3NlcyByYW5kb21seSBmcm9tIGFsbCBwcm92aWRlZCBjaG9pY2VzLiBUaGV5IG11c3QgYmUgc2VwYXJhdGVkIHdpdGggXFxcIi9cXFwiLiBQbGVhc2UgZG9uJ3QgdXNlIHRoaXMgdG8gZGVjaWRlIGltcG9ydGFudCBsaWZlIGNob2ljZXMsIGl0J3MgcHVyZWx5IHJhbmRvbSBvayA/XCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcInB1YmxpY1wiLFxuICAgIGFzeW5jIGFjdGlvbihtc2csIGFyZ3MpIHtcbiAgICAgICAgaWYgKCFhcmdzWzBdIHx8ICFhcmdzWzFdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWlzc2luZ0FyZyhcImNob2ljZXNcIik7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgU2FsdHkubWVzc2FnZShcbiAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgIGBJIGNob29zZSAke2Nob2ljZShhcmdzLmpvaW4oXCIgXCIpLnNwbGl0KFwiL1wiKSl9YFxuICAgICAgICApO1xuICAgIH0sXG59KTtcbiJdfQ==