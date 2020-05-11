import Model from "./Model";
class QuickCommand extends Model {
    constructor() {
        super(...arguments);
        this.keys = "";
        this.effect = "";
        this.name = "";
        this.stored = true;
    }
}
QuickCommand.table = "commands";
export default QuickCommand;
