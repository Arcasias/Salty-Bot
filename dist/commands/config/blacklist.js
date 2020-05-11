import Command from "../../classes/Command";
import { MissingMention, SaltyException } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
export default new Command({
    name: "blacklist",
    keys: ["blackls", "bl"],
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
    visibility: "dev",
    async action(msg, args) {
        const mention = msg.mentions.members.first();
        const user = User.get(mention.user.id);
        switch (this.meaning(args[0])) {
            case "add":
                if (!mention) {
                    throw new MissingMention();
                }
                if (mention.id === Salty.bot.user.id) {
                    return Salty.message(msg, "Woa woa woa ! You can't just put me in my own blacklist you punk !");
                }
                await User.update(user.id, { black_listed: true });
                await Salty.success(msg, `<mention> added to the blacklist`);
                break;
            case "delete":
                if (!mention) {
                    throw new MissingMention();
                }
                if (mention.id === Salty.bot.user.id) {
                    return Salty.message(msg, "Well... as you might expect, I'm not in the blacklist.");
                }
                if (!user.black_listed) {
                    throw new SaltyException(`**${mention.nickname}** is not in the blacklist`);
                }
                await User.update(user.id, { black_listed: false });
                await Salty.success(msg, `<mention> removed from the blacklist`);
                break;
            default:
                if (mention) {
                    if (mention.id === Salty.bot.user.id) {
                        await Salty.message(msg, "Nope, I am not and will never be in the blacklist");
                    }
                    else {
                        await Salty.message(msg, user.black_listed
                            ? "<mention> is black-listed"
                            : "<mention> isn't black-listed... yet");
                    }
                }
                else {
                    const blackListedUsers = User.filter((u) => u.black_listed).map((u) => Salty.bot.users.get(u.discord_id).username);
                    if (blackListedUsers.length) {
                        await Salty.embed(msg, {
                            title: "Blacklist",
                            description: blackListedUsers.join("\n"),
                        });
                    }
                    else {
                        await Salty.message(msg, "The black list is empty. You can help by *expanding it*.");
                    }
                }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhY2tsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2NvbmZpZy9ibGFja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RSxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLElBQUksTUFBTSxvQkFBb0IsQ0FBQztBQUV0QyxlQUFlLElBQUksT0FBTyxDQUFDO0lBQ3ZCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFDdkIsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxrQ0FBa0M7U0FDN0M7UUFDRDtZQUNJLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLE1BQU0sRUFBRSxnREFBZ0Q7U0FDM0Q7S0FDSjtJQUNELFVBQVUsRUFBRSxLQUFLO0lBQ2pCLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUk7UUFDbEIsTUFBTSxPQUFPLEdBQWdCLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFELE1BQU0sSUFBSSxHQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxLQUFLO2dCQUNOLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ1YsTUFBTSxJQUFJLGNBQWMsRUFBRSxDQUFDO2lCQUM5QjtnQkFDRCxJQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO29CQUNsQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQ2hCLEdBQUcsRUFDSCxvRUFBb0UsQ0FDdkUsQ0FBQztpQkFDTDtnQkFDRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGtDQUFrQyxDQUFDLENBQUM7Z0JBQzdELE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDVixNQUFNLElBQUksY0FBYyxFQUFFLENBQUM7aUJBQzlCO2dCQUNELElBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ2xDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FDaEIsR0FBRyxFQUNILHdEQUF3RCxDQUMzRCxDQUFDO2lCQUNMO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNwQixNQUFNLElBQUksY0FBYyxDQUNwQixLQUFLLE9BQU8sQ0FBQyxRQUFRLDRCQUE0QixDQUNwRCxDQUFDO2lCQUNMO2dCQUNELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsc0NBQXNDLENBQ3pDLENBQUM7Z0JBQ0YsTUFBTTtZQUNWO2dCQUNJLElBQUksT0FBTyxFQUFFO29CQUNULElBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7d0JBQ2xDLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsbURBQW1ELENBQ3RELENBQUM7cUJBQ0w7eUJBQU07d0JBQ0gsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxJQUFJLENBQUMsWUFBWTs0QkFDYixDQUFDLENBQUMsMkJBQTJCOzRCQUM3QixDQUFDLENBQUMscUNBQXFDLENBQzlDLENBQUM7cUJBQ0w7aUJBQ0o7cUJBQU07b0JBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUNoQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FDeEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3pELElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFO3dCQUN6QixNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFOzRCQUNuQixLQUFLLEVBQUUsV0FBVzs0QkFDbEIsV0FBVyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7eUJBQzNDLENBQUMsQ0FBQztxQkFDTjt5QkFBTTt3QkFDSCxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILDBEQUEwRCxDQUM3RCxDQUFDO3FCQUNMO2lCQUNKO1NBQ1I7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3VpbGRNZW1iZXIgfSBmcm9tIFwiZGlzY29yZC5qc1wiO1xuaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IHsgTWlzc2luZ01lbnRpb24sIFNhbHR5RXhjZXB0aW9uIH0gZnJvbSBcIi4uLy4uL2NsYXNzZXMvRXhjZXB0aW9uXCI7XG5pbXBvcnQgU2FsdHkgZnJvbSBcIi4uLy4uL2NsYXNzZXMvU2FsdHlcIjtcbmltcG9ydCBVc2VyIGZyb20gXCIuLi8uLi9jbGFzc2VzL1VzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwiYmxhY2tsaXN0XCIsXG4gICAga2V5czogW1wiYmxhY2tsc1wiLCBcImJsXCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiVGVsbHMgeW91IHdldGhlciB5b3UncmUgYW4gYWRtaW5cIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IFwiKioqbWVudGlvbioqKlwiLFxuICAgICAgICAgICAgZWZmZWN0OiBcIlRlbGxzIHlvdSB3ZXRoZXIgdGhlICoqKm1lbnRpb24qKiogaXMgYW4gYWRtaW5cIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwiZGV2XCIsXG4gICAgYXN5bmMgYWN0aW9uKG1zZywgYXJncykge1xuICAgICAgICBjb25zdCBtZW50aW9uOiBHdWlsZE1lbWJlciA9IG1zZy5tZW50aW9ucy5tZW1iZXJzLmZpcnN0KCk7XG4gICAgICAgIGNvbnN0IHVzZXI6IFVzZXIgPSBVc2VyLmdldChtZW50aW9uLnVzZXIuaWQpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5tZWFuaW5nKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICBjYXNlIFwiYWRkXCI6XG4gICAgICAgICAgICAgICAgaWYgKCFtZW50aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNaXNzaW5nTWVudGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWVudGlvbi5pZCA9PT0gU2FsdHkuYm90LnVzZXIuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbHR5Lm1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgICAgICAgICBcIldvYSB3b2Egd29hICEgWW91IGNhbid0IGp1c3QgcHV0IG1lIGluIG15IG93biBibGFja2xpc3QgeW91IHB1bmsgIVwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IFVzZXIudXBkYXRlKHVzZXIuaWQsIHsgYmxhY2tfbGlzdGVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IFNhbHR5LnN1Y2Nlc3MobXNnLCBgPG1lbnRpb24+IGFkZGVkIHRvIHRoZSBibGFja2xpc3RgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgICAgICAgICBpZiAoIW1lbnRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1pc3NpbmdNZW50aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtZW50aW9uLmlkID09PSBTYWx0eS5ib3QudXNlci5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FsdHkubWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV2VsbC4uLiBhcyB5b3UgbWlnaHQgZXhwZWN0LCBJJ20gbm90IGluIHRoZSBibGFja2xpc3QuXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyLmJsYWNrX2xpc3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU2FsdHlFeGNlcHRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBgKioke21lbnRpb24ubmlja25hbWV9KiogaXMgbm90IGluIHRoZSBibGFja2xpc3RgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IFVzZXIudXBkYXRlKHVzZXIuaWQsIHsgYmxhY2tfbGlzdGVkOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBTYWx0eS5zdWNjZXNzKFxuICAgICAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgICAgIGA8bWVudGlvbj4gcmVtb3ZlZCBmcm9tIHRoZSBibGFja2xpc3RgXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKG1lbnRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbnRpb24uaWQgPT09IFNhbHR5LmJvdC51c2VyLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTYWx0eS5tZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5vcGUsIEkgYW0gbm90IGFuZCB3aWxsIG5ldmVyIGJlIGluIHRoZSBibGFja2xpc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNhbHR5Lm1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuYmxhY2tfbGlzdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCI8bWVudGlvbj4gaXMgYmxhY2stbGlzdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIjxtZW50aW9uPiBpc24ndCBibGFjay1saXN0ZWQuLi4geWV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibGFja0xpc3RlZFVzZXJzID0gVXNlci5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAodSkgPT4gdS5ibGFja19saXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgKS5tYXAoKHUpID0+IFNhbHR5LmJvdC51c2Vycy5nZXQodS5kaXNjb3JkX2lkKS51c2VybmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChibGFja0xpc3RlZFVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2FsdHkuZW1iZWQobXNnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQmxhY2tsaXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGJsYWNrTGlzdGVkVXNlcnMuam9pbihcIlxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2FsdHkubWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaGUgYmxhY2sgbGlzdCBpcyBlbXB0eS4gWW91IGNhbiBoZWxwIGJ5ICpleHBhbmRpbmcgaXQqLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIl19