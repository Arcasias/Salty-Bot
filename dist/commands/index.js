"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../classes/Command"));
const utils_1 = require("../utils");
const config_1 = __importDefault(require("./config"));
const discord_1 = __importDefault(require("./discord"));
const general_1 = __importDefault(require("./general"));
const image_1 = __importDefault(require("./image"));
const misc_1 = __importDefault(require("./misc"));
const music_1 = __importDefault(require("./music"));
const categories = {
    config: config_1.default,
    discord: discord_1.default,
    general: general_1.default,
    image: image_1.default,
    misc: misc_1.default,
    music: music_1.default,
};
for (const category in categories) {
    const categoryDoc = categories[category];
    const categoryInfo = Object.assign({}, categoryDoc, {
        commands: Object.keys(categoryDoc),
    });
    Command_1.default.categories.set(category, categoryInfo);
    const { name, commands } = categoryInfo;
    utils_1.debug(`Category "${name}": ${commands.length} commands loaded.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpRUFBeUM7QUFFekMsb0NBQWlDO0FBQ2pDLHNEQUE4QjtBQUM5Qix3REFBZ0M7QUFDaEMsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUM1QixrREFBMEI7QUFDMUIsb0RBQTRCO0FBRTVCLE1BQU0sVUFBVSxHQUFnQztJQUM1QyxNQUFNLEVBQU4sZ0JBQU07SUFDTixPQUFPLEVBQVAsaUJBQU87SUFDUCxPQUFPLEVBQVAsaUJBQU87SUFDUCxLQUFLLEVBQUwsZUFBSztJQUNMLElBQUksRUFBSixjQUFJO0lBQ0osS0FBSyxFQUFMLGVBQUs7Q0FDUixDQUFDO0FBRUYsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7SUFDL0IsTUFBTSxXQUFXLEdBQXVCLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RCxNQUFNLFlBQVksR0FBd0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFO1FBQ3JFLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUNyQyxDQUFDLENBQUM7SUFDSCxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQy9DLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsWUFBWSxDQUFDO0lBQ3hDLGFBQUssQ0FBQyxhQUFhLElBQUksTUFBTSxRQUFRLENBQUMsTUFBTSxtQkFBbUIsQ0FBQyxDQUFDO0NBQ3BFIn0=