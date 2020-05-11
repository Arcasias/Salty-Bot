import Model from "./Model";
import Playlist from "./Playlist";

class Guild extends Model {
    public playlist: Playlist = new Playlist({});
    public discord_id: string = "0";
    public default_channel: number = null;
    public default_role: number = null;
    protected stored: boolean = true;

    protected static table: string = "guilds";

    public static get(id: string): Guild {
        return this.find((guild: Guild): boolean => guild.discord_id === id);
    }
}

export default Guild;
