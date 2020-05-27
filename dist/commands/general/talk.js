"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "talk",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect: 'I\'ll answer to what you said. As I\'m not a really advanced AI, you may want to try simple things such as "Hello" or "How are you"',
        },
    ],
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
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFsay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RhbGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUE4RDtBQUM5RCx1Q0FBNEM7QUFFNUMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLE1BQU0sRUFDRixxSUFBcUk7U0FDNUk7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxhQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3ZFLE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUMvQixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFFN0IsS0FBSyxNQUFNLElBQUksSUFBSSxlQUFPLEVBQUU7WUFDeEIsS0FBSyxNQUFNLElBQUksSUFBSSxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNuQyxJQUNJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFDckQ7b0JBQ0UsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEI7YUFDSjtTQUNKO1FBQ0QsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ2xCLEtBQUssTUFBTSxZQUFZLElBQUksU0FBUyxFQUFFO2dCQUNsQyxLQUFLLE1BQU0sVUFBVSxJQUFJLGVBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUU7b0JBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxDQUFDLGVBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pEO2FBQ0o7WUFDRCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNoRDthQUFNO1lBQ0gsTUFBTSxNQUFNLEdBQWEsZUFBVyxDQUFDLElBQUksQ0FBQztZQUMxQyxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9