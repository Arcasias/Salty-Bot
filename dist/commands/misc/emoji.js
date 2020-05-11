import fs from "fs";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
const emojiPath = "./assets/img/saltmoji";
export default new Command({
    name: "emoji",
    keys: ["emojis", "saltmoji", "saltmojis"],
    help: [
        {
            argument: null,
            effect: "Shows my emojis list",
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        fs.readdir(emojiPath, (error, files) => {
            if (error) {
                return error(error);
            }
            let pngs = files.filter((file) => file.split(".").pop() === "png");
            let emojiNames = pngs.map((name) => name.split(".").shift());
            if (args[0]) {
                let arg = args[0].toLowerCase();
                let emoji = false;
                if ("rand" === arg || "random" === arg) {
                    emoji = choice(emojiNames);
                }
                else if (emojiNames.includes(arg)) {
                    emoji = arg;
                }
                if (emoji) {
                    msg.delete();
                    return msg.channel.send({
                        files: [`${emojiPath}/${emoji}.png`],
                    });
                }
            }
            Salty.embed(msg, {
                title: "list of saltmojis",
                description: emojiNames.join("\n"),
            });
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9lbW9qaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUUxQyxlQUFlLElBQUksT0FBTyxDQUFDO0lBQ3ZCLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7SUFDekMsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxzQkFBc0I7U0FDakM7UUFDRDtZQUNJLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsTUFBTSxFQUFFLDJCQUEyQjtTQUN0QztLQUNKO0lBQ0QsVUFBVSxFQUFFLFFBQVE7SUFDcEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSTtRQUNsQixFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNuQyxJQUFJLEtBQUssRUFBRTtnQkFDUCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2QjtZQUNELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7WUFDbkUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRTdELElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNULElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUVsQixJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxLQUFLLEdBQUcsRUFBRTtvQkFDcEMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDOUI7cUJBQU0sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNqQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2lCQUNmO2dCQUNELElBQUksS0FBSyxFQUFFO29CQUNQLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDYixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUNwQixLQUFLLEVBQUUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxLQUFLLE1BQU0sQ0FBQztxQkFDdkMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7WUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDYixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDckMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5pbXBvcnQgeyBjaG9pY2UgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuY29uc3QgZW1vamlQYXRoID0gXCIuL2Fzc2V0cy9pbWcvc2FsdG1vamlcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwiZW1vamlcIixcbiAgICBrZXlzOiBbXCJlbW9qaXNcIiwgXCJzYWx0bW9qaVwiLCBcInNhbHRtb2ppc1wiXSxcbiAgICBoZWxwOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBudWxsLFxuICAgICAgICAgICAgZWZmZWN0OiBcIlNob3dzIG15IGVtb2ppcyBsaXN0XCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBcIioqKmVtb2ppIG5hbWUqKipcIixcbiAgICAgICAgICAgIGVmZmVjdDogXCJTZW5kcyB0aGUgaW5kaWNhdGVkIGVtb2ppXCIsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICB2aXNpYmlsaXR5OiBcInB1YmxpY1wiLFxuICAgIGFzeW5jIGFjdGlvbihtc2csIGFyZ3MpIHtcbiAgICAgICAgZnMucmVhZGRpcihlbW9qaVBhdGgsIChlcnJvciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcG5ncyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5zcGxpdChcIi5cIikucG9wKCkgPT09IFwicG5nXCIpO1xuICAgICAgICAgICAgbGV0IGVtb2ppTmFtZXMgPSBwbmdzLm1hcCgobmFtZSkgPT4gbmFtZS5zcGxpdChcIi5cIikuc2hpZnQoKSk7XG5cbiAgICAgICAgICAgIGlmIChhcmdzWzBdKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFyZyA9IGFyZ3NbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBsZXQgZW1vamkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChcInJhbmRcIiA9PT0gYXJnIHx8IFwicmFuZG9tXCIgPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICBlbW9qaSA9IGNob2ljZShlbW9qaU5hbWVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVtb2ppTmFtZXMuaW5jbHVkZXMoYXJnKSkge1xuICAgICAgICAgICAgICAgICAgICBlbW9qaSA9IGFyZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVtb2ppKSB7XG4gICAgICAgICAgICAgICAgICAgIG1zZy5kZWxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1zZy5jaGFubmVsLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtgJHtlbW9qaVBhdGh9LyR7ZW1vaml9LnBuZ2BdLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTYWx0eS5lbWJlZChtc2csIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJsaXN0IG9mIHNhbHRtb2ppc1wiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbW9qaU5hbWVzLmpvaW4oXCJcXG5cIiksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuIl19