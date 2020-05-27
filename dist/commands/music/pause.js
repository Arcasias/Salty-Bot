"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "pause",
    keys: ["freeze"],
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.pause();
                Salty_1.default.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            }
            catch (err) {
                Salty_1.default.error(msg, "the song is already paused");
            }
        }
        else {
            Salty_1.default.error(msg, "there's nothing playing");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF1c2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvcGF1c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUV4QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ2hCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsbUNBQW1DO1NBQzlDO0tBQ0o7SUFDRCxPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLElBQUk7Z0JBQ0EsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxZQUFZLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ3ZELEtBQUssRUFBRSxHQUFHO2lCQUNiLENBQUMsQ0FBQzthQUNOO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQzthQUNsRDtTQUNKO2FBQU07WUFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9