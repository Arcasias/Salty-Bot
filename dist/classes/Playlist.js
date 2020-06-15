"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const utils_1 = require("../utils");
const TIMEOUT = 5 * 60 * 1000;
class Playlist {
    constructor() {
        this.connection = null;
        this.continue = false;
        this.pointer = -1;
        this.queue = [];
        this.repeat = "off";
        this.timeout = null;
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
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.dispatcher.end();
    }
    async join(channel) {
        await channel.join();
    }
    leave() {
        var _a;
        const channel = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.channel;
        if (channel) {
            channel.leave();
        }
        return channel;
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
        if (this.connection && !this.connection.dispatcher.paused) {
            this.connection.dispatcher.pause();
        }
    }
    play() {
        if (this.connection) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.connection.play(ytdl_core_1.default(this.playing.url, { filter: "audioonly" }));
            this.connection.dispatcher.on("close", () => this.onClose());
        }
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
        return removed;
    }
    resume() {
        var _a;
        if ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }
    shuffle() {
        for (let index = this.queue.length - 1; index >= 0; index--) {
            const randId = utils_1.randInt(0, index + 1);
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
    onClose() {
        this.next();
        if (this.continue) {
            this.play();
        }
        else if (this.connection) {
            this.timeout = setTimeout(() => {
                this.leave();
                this.connection = null;
                this.timeout = null;
            }, TIMEOUT);
        }
    }
}
exports.default = Playlist;
