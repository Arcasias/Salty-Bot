import { FieldsDescriptor } from "../types";
import Model from "./Model";
import Playlist from "./Playlist";

class Guild extends Model {
    public id!: number;
    public playlist: Playlist = new Playlist();
    public discord_id!: string;
    public default_channel!: string | null;
    public default_role!: string | null;

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        default_channel: null,
        default_role: null,
    };
    protected static readonly table: string = "guilds";

    public static get(id: string) {
        return this.find((guild: Guild) => guild.discord_id === id);
    }
}

export default Guild;
