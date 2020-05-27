"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "stop",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    access: "admin",
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.stop();
            Salty_1.default.success(msg, utils_1.choice(terms_1.answers.bye), {
                react: "⏹",
            });
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLHVDQUFxQztBQUVyQyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGdEQUFnRDtTQUMzRDtLQUNKO0lBQ0QsTUFBTSxFQUFFLE9BQU87SUFDZixPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQyxLQUFLLEVBQUUsR0FBRzthQUNiLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9