import { ClientEvents } from "discord.js";

export default class Event<K extends keyof ClientEvents> {
    public readonly payload: ClientEvents[K];
    private stopped: boolean = false;

    constructor(payload: ClientEvents[K]) {
        this.payload = payload;
    }

    public isStopped() {
        return this.stopped;
    }

    public stop() {
        if (this.stopped) {
            return false;
        }
        return (this.stopped = true);
    }
}
