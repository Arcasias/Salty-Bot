'use strict';

const ytdl = require('ytdl-core');

/**
 * Contains the attributes and methods required to store and play songs 
 *
 * @param {array} queue: the queue containing the song objects
 * @param {number} pointer: points towards the song that must be played
 * @param {string} repeat: option to repeat one, multiple or no songs
 * @param {object} connection: the connection of the bot with the voice channel
 */
class Playlist {

    /**
     * @constructor
     *
     * @param {array} queue: the queue containing the song objects
     * @param {number} pointer: points towards the song that must be played
     * @param {string} repeat: option to repeat one, multiple or no songs
     * @param {object} connection: the connection of the bot with the voice channel
     */
    constructor(queue, pointer, repeat, connection) {
        this.queue = queue || [];
        this.pointer = pointer || -1;
        this.repeat = repeat || 'off';
        this.connection = connection;
    }

    /**
     * Starts the dispatcher to play the queue
     *
     * @param {object} connection:
     * @param {object} msg: the message that triggered the play command
     * @param {boolean} restart: if the queue must restart after end
     */
    play(connection, restart) {
        if (restart)  {
            this.pointer = -1;
        }
        connection.playStream(ytdl(this.nextSong().url, { filter: 'audioonly' }));
        connection.dispatcher.on('end', () => {
            if (this.checkNext()) {
                this.play(connection);
            } else {
                connection.channel.leave();  
            }
        });
    }

    /**
     * Appends a song to the queue
     *
     * @param {string} title: title of the song
     * @param {number} duration: duration of the song
     * @param {string} url: URL of the song
     * @return {object} the added song
     */
    addSong(title="", duration=0, url="") {
        const song =  {
            title: title,
            duration: duration,
            url: url,
        };
        this.queue.push(song);
        return song;
    }

    /**
     * Removes one or multiple songs from the queue
     *
     * @param {array} songs: array containing the songs to remove
     * @return {object} removed song(s)
     */
    removeSong(songs) {
        let toRemove = [];
        try {
            for (let i = songs.length - 1; i >= 0; i --) {
                toRemove.push(this.queue.splice(songs[i], 1));
            }
        } catch (err) {
            LOG.error(err);
        } finally {
            return toRemove;
        }
    }

    /**
     * Returns the next song. The pointer only moves when the whole queue is repeating or at the very beginning.
     *
     * @return {object} next song
     */
    nextSong() {
        if ('all' === this.repeat || this.pointer < 0) {
            this.pointer ++;
        }
        if (this.pointer in this.queue) {
            return this.getPlaying();
        }
    }

    /**
     * Checks if the queue can continue
     *
     * @param {boolean} pending: if the current song must be kept
     * @return {boolean} if there's a song next to the current one
     */
    checkNext() {
        if (! this.queue[0]) {
            return false;
        }
        // On repeat single and all, the result is always true
        if (this.repeat === 'single') {
            return true;
        } else if (this.repeat === 'all') {
            // Restarts the queue when it's the last song
            if (this.pointer + 1 == this.queue.length) {
                this.pointer = -1;
            }
            return true;
        } else {
            this.queue.splice(this.pointer, 1);
            // On repeat off, it's false if there's nothing to play
            return this.pointer in this.queue;
        }
    }

    /**
     * Gets the current song
     *
     * @return {object} current playing song
     */
    getPlaying() {        
        return this.queue[this.pointer];
    }

    /**
     * Shuffles the queue
     *
     * @return {array} the current queue
     */
    shuffle() {
        for (let id = this.queue.length - 1; id > 0; id --) {
            const randId = Math.floor(Math.random() * (id + 1));
            const temp = this.queue[id];
            this.queue[id] = this.queue[randId];
            this.queue[randId] = temp;
            if (this.pointer == id) {
                this.pointer = randId;
            } else if (this.pointer === randId) {
                this.pointer = id;
            }
        }
        return this.queue;
    }

    /**
     * Clears the queue
     */
    queueClear() {
        this.queue = [];
    }
}

module.exports = Playlist;