import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "resume",
    keys: ["unfreeze"],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.resume();
                Salty.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            }
            catch (err) {
                Salty.error(msg, "the song isn't paused");
            }
        }
        else {
            Salty.error(msg, "there's nothing playing");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3Jlc3VtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUV4QyxlQUFlLElBQUksT0FBTyxDQUFDO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUseUJBQXlCO1NBQ3BDO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLENBQUMsR0FBRztRQUNOLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLElBQUk7Z0JBQ0EsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNsQixLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxhQUFhLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ3hELEtBQUssRUFBRSxHQUFHO2lCQUNiLENBQUMsQ0FBQzthQUNOO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQzthQUM3QztTQUNKO2FBQU07WUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCBHdWlsZCBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9HdWlsZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcInJlc3VtZVwiLFxuICAgIGtleXM6IFtcInVuZnJlZXplXCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiUmVzdW1lcyB0aGUgcGF1c2VkIHNvbmdcIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgYWN0aW9uKG1zZykge1xuICAgICAgICBjb25zdCB7IHBsYXlsaXN0IH0gPSBHdWlsZC5nZXQobXNnLmd1aWxkLmlkKTtcblxuICAgICAgICBpZiAocGxheWxpc3QuY29ubmVjdGlvbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwbGF5bGlzdC5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICBTYWx0eS5zdWNjZXNzKG1zZywgYHJlc3VtZWQgKioke3BsYXlsaXN0LnBsYXlpbmcudGl0bGV9KipgLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWN0OiBcIuKWtlwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgU2FsdHkuZXJyb3IobXNnLCBcInRoZSBzb25nIGlzbid0IHBhdXNlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFNhbHR5LmVycm9yKG1zZywgXCJ0aGVyZSdzIG5vdGhpbmcgcGxheWluZ1wiKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdfQ==