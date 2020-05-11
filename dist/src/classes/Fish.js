import { randRange } from "../utils.js";
import Model from "./Model.js";
class Fish extends Model {
    constructor() {
        super(...arguments);
        this.weight = randRange(this.min_weight, this.max_weight);
        this.value = this.weight * this.value;
    }
}
Fish.table = "fishes";
Fish.fields = {
    name: "",
    description: "",
    quality: "",
    min_weight: 0,
    max_weight: 0,
    value: 0,
    image: "",
};
export default Fish;
