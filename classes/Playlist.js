import Multiton from './Multiton.js';
import ytdl from 'ytdl-core';

class Playlist extends Multiton {
    static fields = {
        connection: null,
        continue: false,
        queue: [],
        pointer: -1,
        repeat: 'off',
    };

    /**
     * @returns {Song}
     */
    get playing() {
        return this.queue[this.pointer];
    }
    /**
     * Adds new items to the queue.

     * @param  {...Object} songs
     * @param  {number} song.duration
     * @param  {string} songs.title
     * @param  {string} songs.url
     */
    add(...songs) {
        songs.forEach(({ duration, title, url}) => {
            this.queue.push(new Song(duration, title, url));
        });
    }
    /**
     * Clears the queue and stops anything playing
     */
    empty() {
        this.queue = [];
    }
    /**
     * Stops the dispatcher
     */
    end() {
        if (this.connection) {
            this.connection.dispatcher.end();
        }
    }

    next() {
        switch (this.repeat) {
            case 'off':
                this.queue.unshift();
                if (this.pointer >= this.queue.length) {
                    this.continue = false;
                }
                break;
            case 'all':
                this.pointer ++;
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
        this.connection.playStream(ytdl(this.playing.url, { filter: 'audioonly' }));
        this.connection.dispatcher.on('end', () => this._onEnd());
    }

    remove(...indices) {
        const removed = [];
        for (let i = indices; i >= 0; i --) {
            removed.push(this.queue.splice(indices[i], 1));
            if (this.pointer >= indices[i]) {
                this.pointer --;
            }
        }
    }

    resume() {
        if (this.connection.dispatcher.paused) {
            this.connection.dispatcher.resume();
        }
    }

    shuffle() {
        for (let index = this.queue.length - 1; index > 0; index --) {
            const randId = Math.floor(Math.random() * (index + 1));
            const temp = this.queue[index];
            this.queue[index] = this.queue[randId];
            this.queue[randId] = temp;
            if (this.pointer === index) {
                this.pointer = randId;
            } else if (this.pointer === randId) {
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

    _onEnd() {
        this.next();
        if (this.continue) {
            this.play();
        } else {
            this.connection.channel.leave();
            this.connection = null;
        }
    }
}

class Song {
    constructor(duration=0, title="", url="") {
        this.duration = duration;
        this.title = title;
        this.url = url;
    }
}

export default Playlist;