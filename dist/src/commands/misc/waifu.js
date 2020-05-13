"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
class WaifuCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "waifu";
        this.keys = ["waifus"];
        this.help = [
            {
                argument: null,
                effect: "Gets you a proper waifu. It's about time",
            },
        ];
    }
    async action({ msg }) {
        const { name, anime, image } = utils_1.choice(list_1.waifus);
        await Salty_1.default.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: utils_1.choice(image) },
        });
    }
}
exports.default = WaifuCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpZnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy93YWlmdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHFDQUFvQztBQUVwQyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLDBDQUEwQzthQUNyRDtTQUNKLENBQUM7SUFVTixDQUFDO0lBUkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRTtRQUNoQixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFNLENBQUMsYUFBTSxDQUFDLENBQUM7UUFDOUMsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNuQixLQUFLLEVBQUUsSUFBSTtZQUNYLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRTtZQUM5QixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsY0FBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1NBQ2hDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9