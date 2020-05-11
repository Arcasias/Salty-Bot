import Model from "./Model";

class User extends Model {
    public discord_id: string = "0";
    public black_listed: boolean = false;
    protected stored: boolean = true;

    protected static table = "users";

    public static get(id: string): User {
        return this.find((user: User): boolean => user.discord_id === id);
    }
}

export default User;
