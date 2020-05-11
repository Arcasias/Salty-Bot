import Model from "./Model";

class QuickCommand extends Model {
    public keys: string = "";
    public effect: string = "";
    public name: string = "";

    protected static readonly fields = ["keys", "effect", "name"];
    protected static readonly table = "commands";

    async run() {
        eval(this.effect);
    }
}

export default QuickCommand;