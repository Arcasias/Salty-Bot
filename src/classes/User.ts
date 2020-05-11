import Model from "./Model";

class User extends Model {
    public discord_id: string;
    public black_listed: boolean;
    public todo: string[];

    protected static readonly fields = ["discord_id", "black_listed", "todo"];
    protected static readonly table = "users";

    public static get(id: string): User {
        return this.find((user: User) => user.discord_id === id);
    }
}

export default User;
