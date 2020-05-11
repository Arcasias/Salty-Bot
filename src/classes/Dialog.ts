import { Message, User } from "discord.js";
import Model from "./Model";

const DIALOG_TIMEOUT = 300000;

type Actions = { [id: string]: Function };

class Dialog extends Model {
    public origin: Message;
    public author: User;
    public response: Message;
    public actions: Actions;
    public timeOut: number | null;

    protected static readonly fields = [
        "origin",
        "author",
        "response",
        "actions",
        "timeOut",
    ];

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
