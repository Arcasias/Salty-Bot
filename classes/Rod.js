'use strict';

const Multiton = require('./Multiton');

class Rod extends Multiton {
    constructor(values) {
        super(...arguments);
    }
}

Rod.table = 'rods';
Rod.fields = {
    name: 0,
    description: "",
    quality: "",
    price: 0,
    time_min: 0,
    time_max: 0,
    chance_common: 0,
    chance_uncommon: 0,
    chance_rare: 0,
    chance_epic: 0,
    chance_legendary: 0,
    chance_mythic: 0,
    chance_forgotten: 0,
};

module.exports = Rod;