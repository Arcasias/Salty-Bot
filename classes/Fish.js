'use strict';

const Multiton = require('./Multiton.js');

class Fish extends Multiton {
    constructor() {
        super(...arguments);

        this.weight = UTIL.randRange(this.min_weight, this.max_weight);
        this.value = this.weight * this.value;
    }
}
Fish.table = 'fishes';
Fish.fields = {
    name: "",
    description: "",
    quality: "",
    min_weight: 0,
    max_weight: 0,
    value: 0,
    image: "",
};

module.exports = Fish;
