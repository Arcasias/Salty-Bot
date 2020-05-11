import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
export default new Command({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    visibility: "dev",
    async action(msg) {
        await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvcmVzdGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUV4QyxlQUFlLElBQUksT0FBTyxDQUFDO0lBQ3ZCLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSwyQ0FBMkM7U0FDdEQ7S0FDSjtJQUNELFVBQVUsRUFBRSxLQUFLO0lBQ2pCLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRztRQUNaLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxNQUFNLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcInJlc3RhcnRcIixcbiAgICBrZXlzOiBbXCJyZXNldFwiXSxcbiAgICBoZWxwOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBudWxsLFxuICAgICAgICAgICAgZWZmZWN0OiBcIkRpc2Nvbm5lY3RzIG1lIGFuZCByZWNvbm5lY3RzIHJpZ2h0IGFmdGVyXCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcImRldlwiLFxuICAgIGFzeW5jIGFjdGlvbihtc2cpIHtcbiAgICAgICAgYXdhaXQgU2FsdHkuc3VjY2Vzcyhtc2csIFwiUmVzdGFydGluZyAuLi5cIik7XG4gICAgICAgIGF3YWl0IFNhbHR5LnJlc3RhcnQoKTtcbiAgICB9LFxufSk7XG4iXX0=