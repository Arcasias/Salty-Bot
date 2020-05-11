import { debug, error } from "../utils";
import { DeprecatedCommand, PermissionDenied, SaltyException, } from "./Exception";
import Model from "./Model";
import Salty from "./Salty";
const permissions = {
    public: null,
    admin: Salty.isAdmin,
    dev: Salty.isDev,
    owner: Salty.isOwner,
};
const MEANING_ACTIONS = [
    "add",
    "delete",
    "clear",
    "list",
    "bot",
    "buy",
    "sell",
];
class Command extends Model {
    /**
     * Runs the command action
     */
    async run(msg, args) {
        try {
            if (this.deprecated) {
                throw new DeprecatedCommand(this.name);
            }
            if (this.visibility !== "public" &&
                !permissions[this.visibility].call(Salty, msg.author, msg.guild)) {
                throw new PermissionDenied(this.visibility);
            }
            if (this.env && this.env !== process.env.MODE) {
                debug(this.name, this.env);
                throw new SaltyException("WrongEnvironment", "it looks like I'm not in the right environment to do that");
            }
            await this.action(msg, args);
        }
        catch (err) {
            if (err instanceof SaltyException) {
                return Salty.error(msg, err.message);
            }
            else {
                error(err.stack);
            }
        }
    }
    meaning(word) {
        if (word && word.length) {
            return (MEANING_ACTIONS.find((w) => Salty.getList(w).includes(word)) ||
                "string");
        }
        else {
            return "noarg";
        }
    }
}
export default Command;
