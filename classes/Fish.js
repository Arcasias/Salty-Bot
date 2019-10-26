import Multiton from './Multiton.js';

class Fish extends Multiton {
    static table = 'fishes';
    static fields = {
        name: "",
        description: "",
        quality: "",
        min_weight: 0,
        max_weight: 0,
        value: 0,
        image: "",
    };

    constructor(values) {
        super(...arguments);

        this.weight = UTIL.randRange(this.min_weight, this.max_weight);
        this.value = this.weight * this.value;
    }
}

export default Fish;