import Model from "./Model";

class QuickCommand extends Model {
    public keys: string = "";
    public effect: string = "";
    public name: string = "";
    protected stored: boolean = true;

    protected static table = "commands";
}

export default QuickCommand;
