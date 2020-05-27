"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "leave",
    keys: ["exit", "quit"],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    access: "admin",
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.end();
            Salty_1.default.success(msg, `leaving **${msg.channel.name}**`);
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvbGVhdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUV4QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztJQUN0QixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGtDQUFrQztTQUM3QztLQUNKO0lBQ0QsTUFBTSxFQUFFLE9BQU87SUFDZixPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNmLGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILGFBQTJCLEdBQUcsQ0FBQyxPQUFRLENBQUMsSUFBSSxJQUFJLENBQ25ELENBQUM7U0FDTDthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMifQ==