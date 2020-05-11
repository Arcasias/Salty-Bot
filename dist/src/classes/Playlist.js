"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Model_1 = __importDefault(require("./Model"));
class Playlist extends Model_1.default {
    constructor() {
        super(...arguments);
        this.connection = null;
        this.continue = false;
        this.queue = [];
        this.pointer = -1;
        this.repeat = "off";
    }
    get playing() {
        return this.queue[this.pointer];
    }
    add(...songs) {
        songs.forEach(({ duration, title, url }) => {
            this.queue.push({ duration, title, url });
        });
    }
    empty() {
        this.queue = [];
    }
    end() {
        if (this.connection) {
            this.connection.dispatcher.end();
        }
    }
    next() {
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
    pause() {
        if (!this.connection.dispatcher.paused) {
            this.connection.dispatcher.pause();
        }
    }
    play() {
        this.connection.play(ytdl_core_1.default(this.playing.url, { filter: "audioonly" }));
        this.connection.dispatcher.on("end", () => this.onEnd());
    }
    remove(...indices) {
        const removed = [];
        for (let i = indices.length; i >= 0; i--) {
            const [removedSong] = this.queue.splice(indices[i], 1);
            removed.push(removedSong);
            if (this.pointer >= indices[i]) {
                this.pointer--;
            }
        }
    }
    resume() {
        if (this.connection.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }
    shuffle() {
        for (let index = this.queue.length - 1; index > 0; index--) {
            const randId = Math.floor(Math.random() * (index + 1));
            const temp = this.queue[index];
            this.queue[index] = this.queue[randId];
            this.queue[randId] = temp;
            if (this.pointer === index) {
                this.pointer = randId;
            }
            else if (this.pointer === randId) {
                this.pointer = index;
            }
        }
    }
    skip() {
        this.end();
    }
    async start(channel) {
        this.continue = true;
        this.pointer = 0;
        this.connection = await channel.join();
        this.play();
    }
    stop() {
        this.continue = false;
        this.end();
        this.empty();
    }
    onEnd() {
        this.next();
        if (this.continue) {
            this.play();
        }
        else {
            this.connection.channel.leave();
            this.connection = null;
        }
    }
}
Playlist.fields = [
    "connection",
    "continue",
    "queue",
    "pointer",
    "repeat",
];
exports.default = Playlist;