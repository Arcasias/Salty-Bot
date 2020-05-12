import Model, { FieldsDescriptor } from "./Model";

class QuickCommand extends Model {
    public keys: string;
    public effect: string;
    public name: string;

    protected static readonly fields: FieldsDescriptor = {
        keys: "",
        effect: "",
        name: "",
    };
    protected static readonly table = "commands";

    async run() {
        eval(this.effect);
    }
}

export default QuickCommand;
