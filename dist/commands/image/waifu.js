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
    name: "waifu",
    keys: ["waifus"],
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ],
    async action({ msg }) {
        const { name, anime, image } = utils_1.choice(terms_1.waifus);
        await Salty_1.default.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: utils_1.choice(image) },
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpZnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvaW1hZ2Uvd2FpZnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUFxQztBQUNyQyx1Q0FBcUM7QUFFckMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNoQixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLDBDQUEwQztTQUNyRDtLQUNKO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRTtRQUNoQixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFNLENBQUMsY0FBTSxDQUFDLENBQUM7UUFDOUMsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNuQixLQUFLLEVBQUUsSUFBSTtZQUNYLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRTtZQUM5QixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsY0FBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1NBQ2hDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSixDQUFDLENBQUMifQ==