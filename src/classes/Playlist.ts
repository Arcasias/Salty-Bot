import { VoiceChannel, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";
import { Song } from "../types";
import { randInt } from "../utils";

const TIMEOUT = 5 * 60 * 1000;

class Playlist {
    public connection: VoiceConnection | null = null;
    public continue: boolean = false;
    public pointer: number = -1;
    public queue: Song[] = [];
    public repeat: string = "off";
    private timeout: NodeJS.Timeout | null = null;

    public get playing(): Song {
        return this.queue[this.pointer];
    }

    /**
     * Adds new items to the queue.
     */
    public add(...songs: Song[]): void {
        songs.forEach(({ duration, title, url }) => {
            this.queue.push({ duration, title, url });
        });
    }

    /**
     * Clears the queue and stops anything playing
     */
    public empty(): void {
        this.queue = [];
    }

    /**
     * Stops the dispatcher
     */
    public end(): void {
        this.connection?.dispatcher.end();
    }

    public async join(channel: VoiceChannel): Promise<void> {
        await channel.join();
    }

    public leave() {
        const channel = this.connection?.channel;
        if (channel) {
            channel.leave();
        }
        return channel;
    }

    public next(): void {
        switch (this.repeat) {
            case "off":
                this.queue.unshift();
                if (this.pointer >= this.queue.length) {
                    this.continue = false;
                }
                break;
            case "all":
                this.pointer++;
                if (this.pointer >= this.queue.length) {
                    this.pointer = 0;
                }
                break;
        }
    }

    public pause(): void {
        if (this.connection && !this.connection.dispatcher.paused) {
            this.connection.dispatcher.pause();
        }
    }

    public play(): void {
        if (this.connection) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.connection.play(
                ytdl(this.playing.url, { filter: "audioonly" })
            );
            this.connection.dispatcher.on("close", () => this.onClose());
        }
    }

    public remove(...indices: number[]): Song[] {
        const removed: Song[] = [];
        for (let i = indices.length; i >= 0; i--) {
            const [removedSong] = this.queue.splice(indices[i], 1);
            removed.push(removedSong);
            if (this.pointer >= indices[i]) {
                this.pointer--;
            }
        }
        return removed;
    }

    public resume(): void {
        if (this.connection?.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }

    public shuffle(): void {
        for (let index: number = this.queue.length - 1; index >= 0; index--) {
            const randId: number = randInt(0, index + 1);
            const temp: Song = this.queue[index];
            this.queue[index] = this.queue[randId];
            this.queue[randId] = temp;
            if (this.pointer === index) {
                this.pointer = randId;
            } else if (this.pointer === randId) {
                this.pointer = index;
            }
        }
    }

    public skip(): void {
        this.end();
    }

    public async start(channel: VoiceChannel): Promise<void> {
        this.continue = true;
        this.pointer = 0;
        this.connection = await channel.join();
        this.play();
    }

    public stop(): void {
        this.continue = false;
        this.end();
        this.empty();
    }

    private onClose(): void {
        this.next();
        if (this.continue) {
            this.play();
        } else if (this.connection) {
            this.timeout = setTimeout(() => {
                this.leave();
                this.connection = null;
                this.timeout = null;
            }, TIMEOUT);
        }
    }
}

export default Playlist;
