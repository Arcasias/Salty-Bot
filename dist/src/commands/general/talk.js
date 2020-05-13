"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
class TalkCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "talk";
        this.keys = [];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "***anything***",
                effect: 'I\'ll answer to what you said. As I\'m not a really advanced AI, you may want to try simple things such as "Hello" or "How are you"',
            },
        ];
    }
    async action({ msg, args }) {
        const cleanedMsg = " " + args.map((arg) => utils_1.clean(arg)).join(" ") + " ";
        const meanFound = [];
        const answers = [];
        for (const mean in list_1.meaning) {
            for (const term of list_1.meaning[mean].list) {
                if (!meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + term + " ", "g"))) {
                    meanFound.push(mean);
                }
            }
        }
        if (meanFound.length) {
            for (const meaningFound of meanFound) {
                for (const answerType of list_1.meaning[meaningFound].answers) {
                    answers.push(utils_1.choice(list_1.answers[answerType]));
                }
            }
            await Salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = list_1.answers.rand;
            await Salty_1.default.message(msg, utils_1.choice(random));
        }
    }
}
exports.default = TalkCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFsay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RhbGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUE0QztBQUM1QyxxQ0FBNkQ7QUFFN0QsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsTUFBTSxFQUNGLHFJQUFxSTthQUM1STtTQUNKLENBQUM7SUE2Qk4sQ0FBQztJQTNCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixNQUFNLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsYUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN2RSxNQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDL0IsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBRTdCLEtBQUssTUFBTSxJQUFJLElBQUksY0FBTyxFQUFFO1lBQ3hCLEtBQUssTUFBTSxJQUFJLElBQUksY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDbkMsSUFDSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUN6QixVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQ3JEO29CQUNFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3hCO2FBQ0o7U0FDSjtRQUNELElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUNsQixLQUFLLE1BQU0sWUFBWSxJQUFJLFNBQVMsRUFBRTtnQkFDbEMsS0FBSyxNQUFNLFVBQVUsSUFBSSxjQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxFQUFFO29CQUNwRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQU0sQ0FBQyxjQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDthQUNKO1lBQ0QsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNILE1BQU0sTUFBTSxHQUFhLGNBQVcsQ0FBQyxJQUFJLENBQUM7WUFDMUMsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUM1QztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFdBQVcsQ0FBQyJ9