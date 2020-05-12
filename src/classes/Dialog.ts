import { Message, User } from "discord.js";
import Model, { FieldsDescriptor } from "./Model";

const DIALOG_TIMEOUT = 300000;

type Actions = { [id: string]: Function };

class Dialog extends Model {
    public actions: Actions;
    public author: User;
    public origin: Message;
    public response: Message;
    public timeOut: number | null;

    protected static readonly fields: FieldsDescriptor = {
        actions: {},
        author: null,
        origin: null,
        response: null,
        timeOut: null,
    };

    constructor(origin: Message, response: Message, actions: Actions = {}) {
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

    run(react: string) {
        if (react in this.actions) {
            this.actions[react]();
            this.destroy();
        }
    }
}

export default Dialog;
