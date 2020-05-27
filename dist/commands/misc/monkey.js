"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "monkey",
    keys: [
        "bogosort",
        "monkeysort",
        "permutationsort",
        "shotgunsort",
        "slowsort",
        "stupidsort",
    ],
    help: [
        {
            argument: null,
            effect: "Monkey sorts a 10 elements array",
        },
        {
            argument: "***array length***",
            effect: "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we?)",
        },
    ],
    async action({ args, msg }) {
        if (!args[0]) {
            return Salty_1.default.warn(msg, "Missing the length of the array.");
        }
        if (Number(args[0]) < 1) {
            return Salty_1.default.warn(msg, "Array length must be a number between 1 and 10.");
        }
        const runningMsg = await Salty_1.default.message(msg, "monkey sorting ...");
        let tests = 0;
        let length = Math.min(Number(args[0]), 10);
        let list = [];
        const sortingTime = await new Promise((resolve) => {
            for (let i = 0; i < length; i++) {
                list.push(i);
            }
            list = utils_1.shuffle(list);
            tests = 0;
            const startTimeStamp = Date.now();
            while (!utils_1.isSorted(list)) {
                list = utils_1.shuffle(list);
                tests++;
            }
            resolve(Math.floor((Date.now() - startTimeStamp) / 100) / 10);
        });
        runningMsg.delete();
        await Salty_1.default.success(msg, `monkey sort on a **${length}** elements list took **${sortingTime}** seconds in **${tests}** tests`, { react: "🐒" });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ua2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvbW9ua2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4Qyx1Q0FBZ0Q7QUFFaEQsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRTtRQUNGLFVBQVU7UUFDVixZQUFZO1FBQ1osaUJBQWlCO1FBQ2pCLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtLQUNmO0lBQ0QsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxrQ0FBa0M7U0FDN0M7UUFDRDtZQUNJLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsTUFBTSxFQUNGLDJHQUEyRztTQUNsSDtLQUNKO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNWLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztTQUM5RDtRQUNELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQ2IsR0FBRyxFQUNILGlEQUFpRCxDQUNwRCxDQUFDO1NBQ0w7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxHQUFHLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRVYsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRWxDLE9BQU8sQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwQixJQUFJLEdBQUcsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixLQUFLLEVBQUUsQ0FBQzthQUNYO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEIsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxzQkFBc0IsTUFBTSwyQkFBMkIsV0FBVyxtQkFBbUIsS0FBSyxVQUFVLEVBQ3BHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUNsQixDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQyJ9