import { Message, User } from "discord.js";
import Model, { FieldsDescriptor } from "./Model";

const DIALOG_TIMEOUT = 300000;

type DialogActions = { [id: string]: Function };

class Dialog {
    public actions: DialogActions;
    public response: Message;
    private timeOut: number | null;

    protected static readonly fields: FieldsDescriptor = {
        actions: {},
        author: null,
        origin: null,
        response: null,
        timeOut: null,
    };

    constructor(response: Message, actions: DialogActions = {}) {
        this.response = response;
        this.actions = actions;
        const timeoutId = setTimeout(() => {
            this.timeOut = null;
        }, DIALOG_TIMEOUT);
        this.timeOut = Number(timeoutId);
    }

    run(react: string) {
        if (react in this.actions) {
            this.actions[react]();
        }
    }
}

export default Dialog;
