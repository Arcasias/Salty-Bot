'use strict';

const Multiton = require('./Multiton.js');
const Playlist = require('./Playlist.js');

class Guild extends Multiton {
	constructor() {
		super(...arguments);

		this.playlist = new Playlist({});
	}

    static get(id) {
        return this.find(guild => parseInt(guild.discord_id, 10) === parseInt(id));
    }
}
Guild.table = 'guilds';
Guild.fields = {
   discord_id: 0,
   default_channel: null,
   default_role: null,
};

module.exports = Guild;
