import { FieldsDescriptor } from "../types";
import Model from "./Model";

class User extends Model {
    public id!: number;
    public discord_id!: string;
    public black_listed!: boolean;
    public todos!: string[];

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        black_listed: false,
        todos: [],
    };
    protected static readonly table = "users";

    public static get(id: string): User | null {
        return this.find((user: User) => user.discord_id === id);
    }
}

export default User;
