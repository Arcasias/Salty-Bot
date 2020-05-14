"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const Model_1 = __importDefault(require("./Model"));
const utils_1 = require("../utils");
class Playlist extends Model_1.default {
    constructor() {
        super(...arguments);
        this.connection = null;
        this.continue = false;
        this.pointer = -1;
        this.queue = [];
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
        if (this.connection && !this.connection.dispatcher.paused) {
            this.connection.dispatcher.pause();
        }
    }
    play() {
        if (this.connection) {
            this.connection.play(ytdl_core_1.default(this.playing.url, { filter: "audioonly" }));
            this.connection.dispatcher.on("end", () => this.onEnd());
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
    }
    resume() {
        var _a;
        if ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }
    shuffle() {
        for (let index = this.queue.length - 1; index > 0; index--) {
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
    onEnd() {
        this.next();
        if (this.continue) {
            this.play();
        }
        else if (this.connection) {
            this.connection.channel.leave();
            this.connection = null;
        }
    }
}
Playlist.fields = {
    queue: [],
    repeat: "off",
};
exports.default = Playlist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9QbGF5bGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDBEQUE2QjtBQUM3QixvREFBa0Q7QUFDbEQsb0NBQW1DO0FBUW5DLE1BQU0sUUFBUyxTQUFRLGVBQUs7SUFBNUI7O1FBQ1csZUFBVSxHQUEyQixJQUFJLENBQUM7UUFDMUMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixZQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixXQUFNLEdBQVcsS0FBSyxDQUFDO0lBNkhsQyxDQUFDO0lBdEhHLElBQVcsT0FBTztRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUtNLEdBQUcsQ0FBQyxHQUFHLEtBQWE7UUFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtNLEtBQUs7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBS00sR0FBRztRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFTSxJQUFJO1FBQ1AsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2pCLEtBQUssS0FBSztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNy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