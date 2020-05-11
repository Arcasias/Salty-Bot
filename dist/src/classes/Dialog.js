import Model from "./Model";
const DIALOG_TIMEOUT = 300000;
class Dialog extends Model {
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
export default Dialog;
