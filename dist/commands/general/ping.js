import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { generate, title } from "../../utils";
const MESSAGES = [
    "nearly perfect !",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag ?",
    "dear god are you on a safari in the middle of the ocean ?",
    "get off of this world you fucking chinese",
];
export default new Command({
    name: "ping",
    keys: ["latency", "test"],
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],
    visibility: "public",
    async action(msg) {
        // If too much salt, skips the latency test
        if (generate(3)) {
            await Salty.error(msg, "pong, and I don't give a fuck about your latency");
        }
        else {
            // Sends another message and displays the difference between the first and the second
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = MESSAGES[Math.floor(latency / 100)] || "lol wat";
            await sentMsg.delete();
            await Salty.success(msg, `pong ! Latency is ${latency}. ${title(message)}`);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3BpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFOUMsTUFBTSxRQUFRLEdBQUc7SUFDYixrQkFBa0I7SUFDbEIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIsb0JBQW9CO0lBQ3BCLHlCQUF5QjtJQUN6Qix3QkFBd0I7SUFDeEIsc0RBQXNEO0lBQ3RELDJEQUEyRDtJQUMzRCwyQ0FBMkM7Q0FDOUMsQ0FBQztBQUVGLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO0lBQ3pCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsNkJBQTZCO1NBQ3hDO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDWiwyQ0FBMkM7UUFDM0MsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDYixNQUFNLEtBQUssQ0FBQyxLQUFLLENBQ2IsR0FBRyxFQUNILGtEQUFrRCxDQUNyRCxDQUFDO1NBQ0w7YUFBTTtZQUNILHFGQUFxRjtZQUNyRixNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7WUFDaEUsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO1lBRWpFLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gscUJBQXFCLE9BQU8sS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FDcEQsQ0FBQztTQUNMO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCBTYWx0eSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9TYWx0eVwiO1xuaW1wb3J0IHsgZ2VuZXJhdGUsIHRpdGxlIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbmNvbnN0IE1FU1NBR0VTID0gW1xuICAgIFwibmVhcmx5IHBlcmZlY3QgIVwiLFxuICAgIFwidGhhdCdzIHByZXR0eSBnb29kXCIsXG4gICAgXCJ0aGF0J3Mgb2ssIGkgZ3Vlc3NcIixcbiAgICBcInRoYXQncyBhIGJpdCBsYWdneVwiLFxuICAgIFwidGhhdCdzIHF1aXRlIGxhZ2d5XCIsXG4gICAgXCJvayB0aGF0J3MgbGFnZ3kgYXMgZnVja1wiLFxuICAgIFwiV1RGIHRoYXQncyBzdXBlciBsYWdneVwiLFxuICAgIFwiSmVzdXMgQ2hyaXN0IGhvdyBjYW4geW91IG1hbmFnZSB3aXRoIHRoYXQgbXVjaCBsYWcgP1wiLFxuICAgIFwiZGVhciBnb2QgYXJlIHlvdSBvbiBhIHNhZmFyaSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBvY2VhbiA/XCIsXG4gICAgXCJnZXQgb2ZmIG9mIHRoaXMgd29ybGQgeW91IGZ1Y2tpbmcgY2hpbmVzZVwiLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwicGluZ1wiLFxuICAgIGtleXM6IFtcImxhdGVuY3lcIiwgXCJ0ZXN0XCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiVGVzdHMgY2xpZW50LXNlcnZlciBsYXRlbmN5XCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcInB1YmxpY1wiLFxuICAgIGFzeW5jIGFjdGlvbihtc2cpIHtcbiAgICAgICAgLy8gSWYgdG9vIG11Y2ggc2FsdCwgc2tpcHMgdGhlIGxhdGVuY3kgdGVzdFxuICAgICAgICBpZiAoZ2VuZXJhdGUoMykpIHtcbiAgICAgICAgICAgIGF3YWl0IFNhbHR5LmVycm9yKFxuICAgICAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgICAgICBcInBvbmcsIGFuZCBJIGRvbid0IGdpdmUgYSBmdWNrIGFib3V0IHlvdXIgbGF0ZW5jeVwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU2VuZHMgYW5vdGhlciBtZXNzYWdlIGFuZCBkaXNwbGF5cyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgdGhlIHNlY29uZFxuICAgICAgICAgICAgY29uc3Qgc2VudE1zZyA9IGF3YWl0IG1zZy5jaGFubmVsLnNlbmQoXCJQaW5naW5nLi4uXCIpO1xuICAgICAgICAgICAgY29uc3QgbGF0ZW5jeSA9IHNlbnRNc2cuY3JlYXRlZFRpbWVzdGFtcCAtIG1zZy5jcmVhdGVkVGltZXN0YW1wO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IE1FU1NBR0VTW01hdGguZmxvb3IobGF0ZW5jeSAvIDEwMCldIHx8IFwibG9sIHdhdFwiO1xuXG4gICAgICAgICAgICBhd2FpdCBzZW50TXNnLmRlbGV0ZSgpO1xuICAgICAgICAgICAgYXdhaXQgU2FsdHkuc3VjY2VzcyhcbiAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgYHBvbmcgISBMYXRlbmN5IGlzICR7bGF0ZW5jeX0uICR7dGl0bGUobWVzc2FnZSl9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdfQ==