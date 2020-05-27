"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "skip",
    keys: ["next"],
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.skip();
            Salty_1.default.success(msg, `skipped **${playlist.playing.title}**, but it was trash anyway`, { react: "⏩" });
        }
        else {
            Salty_1.default.error(msg, "I'm not connected to a voice channel");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9za2lwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFFeEMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNkLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsd0JBQXdCO1NBQ25DO0tBQ0o7SUFDRCxPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCxhQUFhLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyw2QkFBNkIsRUFDaEUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQ2pCLENBQUM7U0FDTDthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztTQUM1RDtJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMifQ==