import { VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";
import Model, { FieldsDescriptor } from "./Model";

interface Song {
    duration: number;
    title: string;
    url: string;
}

class Playlist extends Model {
    public connection: VoiceConnection | null = null;
    public continue: boolean = false;
    public pointer: number = -1;
    public queue: Song[];
    public repeat: string = "off";

    protected static readonly fields: FieldsDescriptor = {
        queue: [],
        repeat: "off",
    };

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
        if (this.connection) {
            this.connection.dispatcher.end();
        }
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
        if (!this.connection.dispatcher.paused) {
            this.connection.dispatcher.pause();
        }
    }

    public play(): void {
        this.connection.play(ytdl(this.playing.url, { filter: "audioonly" }));
        this.connection.dispatcher.on("end", () => this.onEnd());
    }

    public remove(...indices: number[]): void {
        const removed: Song[] = [];
        for (let i = indices.length; i >= 0; i--) {
            const [removedSong] = this.queue.splice(indices[i], 1);
            removed.push(removedSong);
            if (this.pointer >= indices[i]) {
                this.pointer--;
            }
        }
    }

    public resume(): void {
        if (this.connection.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }

    public shuffle(): void {
        for (let index: number = this.queue.length - 1; index > 0; index--) {
            const randId: number = Math.floor(Math.random() * (index + 1));
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

    public async start(channel): Promise<void> {
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

    private onEnd(): void {
        this.next();
        if (this.continue) {
            this.play();
        } else {
            this.connection.channel.leave();
            this.connection = null;
        }
    }
}

export default Playlist;
