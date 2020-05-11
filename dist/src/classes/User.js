import Model from "./Model";
class User extends Model {
    constructor() {
        super(...arguments);
        this.discord_id = "0";
        this.black_listed = false;
        this.stored = true;
    }
    static get(id) {
        return this.find((user) => user.discord_id === id);
    }
}
User.table = "users";
export default User;
