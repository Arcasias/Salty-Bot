"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
const DIALOG_TIMEOUT = 300000;
class Dialog extends Model_1.default {
    constructor(origin, response, actions = {}) {
        super(...arguments);
        this.origin = origin;
        this.author = this.origin.author;
        this.response = response;
        this.actions = actions;
        const timeoutId = setTimeout(() => {
            this.timeOut = null;
            this.destroy();
        }, DIALOG_TIMEOUT);
        this.timeOut = Number(timeoutId);
    }
    run(react) {
        if (react in this.actions) {
            this.actions[react]();
            this.destroy();
        }
    }
}
Dialog.fields = {
    actions: {},
    author: null,
    origin: null,
    response: null,
    timeOut: null,
};
exports.default = Dialog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0RBQWtEO0FBRWxELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUk5QixNQUFNLE1BQU8sU0FBUSxlQUFLO0lBZXRCLFlBQVksTUFBZSxFQUFFLFFBQWlCLEVBQUUsVUFBbUIsRUFBRTtRQUNqRSxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUVwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDYixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEI7SUFDTCxDQUFDOztBQTNCeUIsYUFBTSxHQUFxQjtJQUNqRCxPQUFPLEVBQUUsRUFBRTtJQUNYLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLElBQUk7SUFDWixRQUFRLEVBQUUsSUFBSTtJQUNkLE9BQU8sRUFBRSxJQUFJO0NBQ2hCLENBQUM7QUF3Qk4sa0JBQWUsTUFBTSxDQUFDIn0=