"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
class MonkeyCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "monkey";
        this.keys = [
            "bogosort",
            "monkeysort",
            "permutationsort",
            "shotgunsort",
            "slowsort",
            "stupidsort",
        ];
        this.help = [
            {
                argument: null,
                effect: "Monkey sorts a 10 elements array",
            },
            {
                argument: "***array length***",
                effect: "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we?)",
            },
        ];
    }
    async action({ args, msg }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("length");
        }
        if (Number(args[0]) < 1) {
            throw new Exception_1.IncorrectValue("length", "number between 1 and 10");
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
    }
}
exports.default = MonkeyCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ua2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvbW9ua2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQStEO0FBQy9ELHVEQUFxRTtBQUNyRSxnRUFBd0M7QUFDeEMsdUNBQWdEO0FBRWhELE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHO1lBQ1YsVUFBVTtZQUNWLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsYUFBYTtZQUNiLFVBQVU7WUFDVixZQUFZO1NBQ2YsQ0FBQztRQUNLLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQ0FBa0M7YUFDN0M7WUFDRDtnQkFDSSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixNQUFNLEVBQ0YsMkdBQTJHO2FBQ2xIO1NBQ0osQ0FBQztJQXNDTixDQUFDO0lBcENHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLHNCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLDBCQUFjLENBQUMsUUFBUSxFQUFFLHlCQUF5QixDQUFDLENBQUM7U0FDakU7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEI7WUFDRCxJQUFJLEdBQUcsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLEtBQUssR0FBRyxDQUFDLENBQUM7WUFFVixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFbEMsT0FBTyxDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLElBQUksR0FBRyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLEtBQUssRUFBRSxDQUFDO2FBQ1g7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILHNCQUFzQixNQUFNLDJCQUEyQixXQUFXLG1CQUFtQixLQUFLLFVBQVUsRUFDcEcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQ2xCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxhQUFhLENBQUMifQ==