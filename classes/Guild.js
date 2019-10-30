import Multiton from './Multiton.js';
import Playlist from './Playlist.js';

class Guild extends Multiton {
	 static table = 'guilds';
	 static fields = {
	    discord_id: 0,
	    default_channel: null,
	    default_role: null,
	};

	constructor() {
		super(...arguments);

		this.playlist = new Playlist({});
	}

    static get(id) {
        return this.find(guild => parseInt(guild.discord_id, 10) === parseInt(id));
    }
}

export default Guild;