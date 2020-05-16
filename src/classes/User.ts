import Model, { FieldsDescriptor } from "./Model";
import Dialog from "./Dialog";

class User extends Model {
    public id!: number;
    public discord_id!: string;
    public black_listed!: boolean;
    public todo!: string[];
    public dialog: Dialog | null = null;

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        black_listed: "",
        todo: "",
    };
    protected static readonly table = "users";

    public static get(id: string) {
        return this.find((user: User) => user.discord_id === id);
    }
}

export default User;
