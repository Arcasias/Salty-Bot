import Model from "./Model";
import Playlist from "./Playlist";
class Guild extends Model {
    constructor() {
        super(...arguments);
        this.playlist = new Playlist({});
        this.discord_id = "0";
        this.default_channel = null;
        this.default_role = null;
        this.stored = true;
    }
    static get(id) {
        return this.find((guild) => guild.discord_id === id);
    }
}
Guild.table = "guilds";
export default Guild;
