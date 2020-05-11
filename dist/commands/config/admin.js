import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
export default new Command({
    name: "admin",
    keys: ["admins", "administrator", "administrators"],
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ],
    visibility: "public",
    async action(msg) {
        const mention = msg.mentions.users.first();
        const isRequestedUserAdmin = Salty.isAdmin(mention || msg.author, msg.guild);
        // Fuck if/else structures, long live ternary operators
        await Salty.message(msg, mention
            ? // mention
                mention.id === Salty.bot.user.id
                    ? // mention is Salty
                        isRequestedUserAdmin
                            ? // mention is Salty and is admin
                                "of course I'm an admin ;)"
                            : // mention is Salty and not admin
                                "nope, I'm not an admin on this server :c"
                    : // mention is not Salty
                        isRequestedUserAdmin
                            ? // mention is not Salty and is admin
                                "<mention> is a wise and powerful admin"
                            : // mention is not Salty and is not admin
                                "<mention> is not an admin"
            : // author
                isRequestedUserAdmin
                    ? // author is admin
                        "you have been granted the administrators permissions. May your deeds be blessed forever !"
                    : // author is not admin
                        "nope, you're not an admin");
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBRXhDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixDQUFDO0lBQ25ELElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsa0NBQWtDO1NBQzdDO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZUFBZTtZQUN6QixNQUFNLEVBQUUsZ0RBQWdEO1NBQzNEO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDWixNQUFNLE9BQU8sR0FBZ0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEQsTUFBTSxvQkFBb0IsR0FBWSxLQUFLLENBQUMsT0FBTyxDQUMvQyxPQUFPLElBQUksR0FBRyxDQUFDLE1BQU0sRUFDckIsR0FBRyxDQUFDLEtBQUssQ0FDWixDQUFDO1FBRUYsdURBQXVEO1FBQ3ZELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsT0FBTztZQUNILENBQUMsQ0FBQyxVQUFVO2dCQUNWLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDOUIsQ0FBQyxDQUFDLG1CQUFtQjt3QkFDbkIsb0JBQW9COzRCQUNsQixDQUFDLENBQUMsZ0NBQWdDO2dDQUNoQywyQkFBMkI7NEJBQzdCLENBQUMsQ0FBQyxpQ0FBaUM7Z0NBQ2pDLDBDQUEwQztvQkFDaEQsQ0FBQyxDQUFDLHVCQUF1Qjt3QkFDekIsb0JBQW9COzRCQUNwQixDQUFDLENBQUMsb0NBQW9DO2dDQUNwQyx3Q0FBd0M7NEJBQzFDLENBQUMsQ0FBQyx3Q0FBd0M7Z0NBQ3hDLDJCQUEyQjtZQUNqQyxDQUFDLENBQUMsU0FBUztnQkFDWCxvQkFBb0I7b0JBQ3BCLENBQUMsQ0FBQyxrQkFBa0I7d0JBQ2xCLDJGQUEyRjtvQkFDN0YsQ0FBQyxDQUFDLHNCQUFzQjt3QkFDdEIsMkJBQTJCLENBQ3BDLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3VpbGRNZW1iZXIgfSBmcm9tIFwiZGlzY29yZC5qc1wiO1xuaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcImFkbWluXCIsXG4gICAga2V5czogW1wiYWRtaW5zXCIsIFwiYWRtaW5pc3RyYXRvclwiLCBcImFkbWluaXN0cmF0b3JzXCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiVGVsbHMgeW91IHdldGhlciB5b3UncmUgYW4gYWRtaW5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IFwiKioqbWVudGlvbioqKlwiLFxuICAgICAgICAgICAgZWZmZWN0OiBcIlRlbGxzIHlvdSB3ZXRoZXIgdGhlICoqKm1lbnRpb24qKiogaXMgYW4gYWRtaW5cIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgYXN5bmMgYWN0aW9uKG1zZykge1xuICAgICAgICBjb25zdCBtZW50aW9uOiBHdWlsZE1lbWJlciA9IG1zZy5tZW50aW9ucy51c2Vycy5maXJzdCgpO1xuICAgICAgICBjb25zdCBpc1JlcXVlc3RlZFVzZXJBZG1pbjogYm9vbGVhbiA9IFNhbHR5LmlzQWRtaW4oXG4gICAgICAgICAgICBtZW50aW9uIHx8IG1zZy5hdXRob3IsXG4gICAgICAgICAgICBtc2cuZ3VpbGRcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBGdWNrIGlmL2Vsc2Ugc3RydWN0dXJlcywgbG9uZyBsaXZlIHRlcm5hcnkgb3BlcmF0b3JzXG4gICAgICAgIGF3YWl0IFNhbHR5Lm1lc3NhZ2UoXG4gICAgICAgICAgICBtc2csXG4gICAgICAgICAgICBtZW50aW9uXG4gICAgICAgICAgICAgICAgPyAvLyBtZW50aW9uXG4gICAgICAgICAgICAgICAgICBtZW50aW9uLmlkID09PSBTYWx0eS5ib3QudXNlci5pZFxuICAgICAgICAgICAgICAgICAgICA/IC8vIG1lbnRpb24gaXMgU2FsdHlcbiAgICAgICAgICAgICAgICAgICAgICBpc1JlcXVlc3RlZFVzZXJBZG1pblxuICAgICAgICAgICAgICAgICAgICAgICAgPyAvLyBtZW50aW9uIGlzIFNhbHR5IGFuZCBpcyBhZG1pblxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9mIGNvdXJzZSBJJ20gYW4gYWRtaW4gOylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiAvLyBtZW50aW9uIGlzIFNhbHR5IGFuZCBub3QgYWRtaW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub3BlLCBJJ20gbm90IGFuIGFkbWluIG9uIHRoaXMgc2VydmVyIDpjXCJcbiAgICAgICAgICAgICAgICAgICAgOiAvLyBtZW50aW9uIGlzIG5vdCBTYWx0eVxuICAgICAgICAgICAgICAgICAgICBpc1JlcXVlc3RlZFVzZXJBZG1pblxuICAgICAgICAgICAgICAgICAgICA/IC8vIG1lbnRpb24gaXMgbm90IFNhbHR5IGFuZCBpcyBhZG1pblxuICAgICAgICAgICAgICAgICAgICAgIFwiPG1lbnRpb24+IGlzIGEgd2lzZSBhbmQgcG93ZXJmdWwgYWRtaW5cIlxuICAgICAgICAgICAgICAgICAgICA6IC8vIG1lbnRpb24gaXMgbm90IFNhbHR5IGFuZCBpcyBub3QgYWRtaW5cbiAgICAgICAgICAgICAgICAgICAgICBcIjxtZW50aW9uPiBpcyBub3QgYW4gYWRtaW5cIlxuICAgICAgICAgICAgICAgIDogLy8gYXV0aG9yXG4gICAgICAgICAgICAgICAgaXNSZXF1ZXN0ZWRVc2VyQWRtaW5cbiAgICAgICAgICAgICAgICA/IC8vIGF1dGhvciBpcyBhZG1pblxuICAgICAgICAgICAgICAgICAgXCJ5b3UgaGF2ZSBiZWVuIGdyYW50ZWQgdGhlIGFkbWluaXN0cmF0b3JzIHBlcm1pc3Npb25zLiBNYXkgeW91ciBkZWVkcyBiZSBibGVzc2VkIGZvcmV2ZXIgIVwiXG4gICAgICAgICAgICAgICAgOiAvLyBhdXRob3IgaXMgbm90IGFkbWluXG4gICAgICAgICAgICAgICAgICBcIm5vcGUsIHlvdSdyZSBub3QgYW4gYWRtaW5cIlxuICAgICAgICApO1xuICAgIH0sXG59KTtcbiJdfQ==