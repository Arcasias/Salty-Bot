"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const terms_1 = require("../../terms");
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
    async action({ args, msg }) {
        const cleanedMsg = " " + args.map((arg) => utils_1.clean(arg)).join(" ") + " ";
        const meanFound = [];
        const answers = [];
        for (const mean in terms_1.meaning) {
            for (const term of terms_1.meaning[mean].list) {
                if (!meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + term + " ", "g"))) {
                    meanFound.push(mean);
                }
            }
        }
        if (meanFound.length) {
            for (const meaningFound of meanFound) {
                for (const answerType of terms_1.meaning[meaningFound].answers) {
                    answers.push(utils_1.choice(terms_1.answers[answerType]));
                }
            }
            await Salty_1.default.message(msg, answers.join(", "));
        }
        else {
            const random = terms_1.answers.rand;
            await Salty_1.default.message(msg, utils_1.choice(random));
        }
    }
}
exports.default = TalkCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFsay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RhbGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBK0Q7QUFDL0QsZ0VBQXdDO0FBQ3hDLHVDQUE0QztBQUM1Qyx1Q0FBOEQ7QUFFOUQsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsTUFBTSxFQUNGLHFJQUFxSTthQUM1STtTQUNKLENBQUM7SUE2Qk4sQ0FBQztJQTNCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsTUFBTSxVQUFVLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdkUsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQy9CLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUU3QixLQUFLLE1BQU0sSUFBSSxJQUFJLGVBQU8sRUFBRTtZQUN4QixLQUFLLE1BQU0sSUFBSSxJQUFJLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25DLElBQ0ksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDekIsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUNyRDtvQkFDRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN4QjthQUNKO1NBQ0o7UUFDRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDbEIsS0FBSyxNQUFNLFlBQVksSUFBSSxTQUFTLEVBQUU7Z0JBQ2xDLEtBQUssTUFBTSxVQUFVLElBQUksZUFBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sRUFBRTtvQkFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFNLENBQUMsZUFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakQ7YUFDSjtZQUNELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO2FBQU07WUFDSCxNQUFNLE1BQU0sR0FBYSxlQUFXLENBQUMsSUFBSSxDQUFDO1lBQzFDLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDNUM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxXQUFXLENBQUMifQ==