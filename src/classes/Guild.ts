import Model, { FieldsDescriptor } from "./Model";
import Playlist from "./Playlist";

class Guild extends Model {
    public playlist: Playlist = new Playlist({});
    public discord_id: string;
    public default_channel: string;
    public default_role: string;

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        default_channel: "",
        default_role: "",
    };
    protected static readonly table: string = "guilds";

    public static get(id: string): Guild {
        return this.find((guild: Guild) => guild.discord_id === id);
    }
}

export default Guild;
