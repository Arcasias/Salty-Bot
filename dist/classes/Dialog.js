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
exports.default = Dialog;
