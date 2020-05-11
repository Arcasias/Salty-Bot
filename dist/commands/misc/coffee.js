import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
export default new Command({
    name: "coffee",
    keys: ["cof", "covfefe"],
    help: [
        {
            argument: null,
            effect: "Gets you a nice hot coffee",
        },
        {
            argument: "***mention***",
            effect: "Gets the ***mention*** a nice hot coffee",
        },
    ],
    visibility: "public",
    async action(msg) {
        const { author } = msg;
        const mention = msg.mentions.users.first();
        const options = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            color: 0x523415,
        };
        if (mention) {
            if (mention.id === Salty.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            }
            else {
                options.description = `Made with ♥ by **${author.username}** for **${mention.username}**`;
            }
        }
        else {
            if (Salty.fishing[author.id]) {
                if ("coffee" === Salty.fishing[author.id].bait) {
                    options.title =
                        "<author> threw another coffee into the sea";
                    options.description =
                        "you already did that, such a waste:c";
                }
                else {
                    Salty.fishing[author.id].bait = "coffee";
                    options.title =
                        "<author> just threw a coffee into the sea !";
                    options.description = "what could possibly happen ?";
                }
            }
        }
        await Salty.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29mZmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY29mZmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBRXhDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDO0lBQ3hCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsNEJBQTRCO1NBQ3ZDO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZUFBZTtZQUN6QixNQUFNLEVBQUUsMENBQTBDO1NBQ3JEO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDWixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHO1lBQ1osS0FBSyxFQUFFLHVCQUF1QjtZQUM5QixXQUFXLEVBQUUsMkJBQTJCO1lBQ3hDLEtBQUssRUFDRCx3RkFBd0Y7WUFDNUYsS0FBSyxFQUFFLFFBQVE7U0FDbEIsQ0FBQztRQUNGLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQzthQUM5RDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsV0FBVyxHQUFHLG9CQUFvQixNQUFNLENBQUMsUUFBUSxZQUFZLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQzthQUM3RjtTQUNKO2FBQU07WUFDSCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLFFBQVEsS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQzVDLE9BQU8sQ0FBQyxLQUFLO3dCQUNULDRDQUE0QyxDQUFDO29CQUNqRCxPQUFPLENBQUMsV0FBVzt3QkFDZixzQ0FBc0MsQ0FBQztpQkFDOUM7cUJBQU07b0JBQ0gsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztvQkFDekMsT0FBTyxDQUFDLEtBQUs7d0JBQ1QsNkNBQTZDLENBQUM7b0JBQ2xELE9BQU8sQ0FBQyxXQUFXLEdBQUcsOEJBQThCLENBQUM7aUJBQ3hEO2FBQ0o7U0FDSjtRQUNELE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kIGZyb20gXCIuLi8uLi9jbGFzc2VzL0NvbW1hbmRcIjtcbmltcG9ydCBTYWx0eSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9TYWx0eVwiO1xuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29tbWFuZCh7XG4gICAgbmFtZTogXCJjb2ZmZWVcIixcbiAgICBrZXlzOiBbXCJjb2ZcIiwgXCJjb3ZmZWZlXCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiR2V0cyB5b3UgYSBuaWNlIGhvdCBjb2ZmZWVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IFwiKioqbWVudGlvbioqKlwiLFxuICAgICAgICAgICAgZWZmZWN0OiBcIkdldHMgdGhlICoqKm1lbnRpb24qKiogYSBuaWNlIGhvdCBjb2ZmZWVcIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgYXN5bmMgYWN0aW9uKG1zZykge1xuICAgICAgICBjb25zdCB7IGF1dGhvciB9ID0gbXNnO1xuICAgICAgICBjb25zdCBtZW50aW9uID0gbXNnLm1lbnRpb25zLnVzZXJzLmZpcnN0KCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJ0aGlzIGlzIGEgbmljZSBjb2ZmZWVcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInNwZWNpYWxseSBtYWRlIGZvciB5b3UgOylcIixcbiAgICAgICAgICAgIGltYWdlOlxuICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9jZG4uY25uLmNvbS9jbm5uZXh0L2RhbS9hc3NldHMvMTUwOTI5MTAxMDQ5LWJsYWNrLWNvZmZlZS1zdG9jay1zdXBlci10ZWFzZS5qcGdcIixcbiAgICAgICAgICAgIGNvbG9yOiAweDUyMzQxNSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG1lbnRpb24pIHtcbiAgICAgICAgICAgIGlmIChtZW50aW9uLmlkID09PSBTYWx0eS5ib3QudXNlci5pZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZGVzY3JpcHRpb24gPSBcImhvdyBjdXRlLCB5b3UgZ2F2ZSBtZSBhIGNvZmZlZSBeLV5cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kZXNjcmlwdGlvbiA9IGBNYWRlIHdpdGgg4pmlIGJ5ICoqJHthdXRob3IudXNlcm5hbWV9KiogZm9yICoqJHttZW50aW9uLnVzZXJuYW1lfSoqYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChTYWx0eS5maXNoaW5nW2F1dGhvci5pZF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJjb2ZmZWVcIiA9PT0gU2FsdHkuZmlzaGluZ1thdXRob3IuaWRdLmJhaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aXRsZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxhdXRob3I+IHRocmV3IGFub3RoZXIgY29mZmVlIGludG8gdGhlIHNlYVwiO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRlc2NyaXB0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwieW91IGFscmVhZHkgZGlkIHRoYXQsIHN1Y2ggYSB3YXN0ZTpjXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU2FsdHkuZmlzaGluZ1thdXRob3IuaWRdLmJhaXQgPSBcImNvZmZlZVwiO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRpdGxlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPGF1dGhvcj4ganVzdCB0aHJldyBhIGNvZmZlZSBpbnRvIHRoZSBzZWEgIVwiO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRlc2NyaXB0aW9uID0gXCJ3aGF0IGNvdWxkIHBvc3NpYmx5IGhhcHBlbiA/XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFNhbHR5LmVtYmVkKG1zZywgb3B0aW9ucyk7XG4gICAgfSxcbn0pO1xuIl19