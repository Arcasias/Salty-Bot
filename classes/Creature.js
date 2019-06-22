'use strict';

const creatures = require('../data/creatures.json');
const Multiton = require('./Multiton');

class Creature extends Multiton {

    constructor(creatureId) {
        super(...arguments);

        let creature = creatures[creatureId];

        this.creatureId = creatureId;
        this.name = creature.name;
        this.description = creature.description;
        this.quality = creature.quality;
        this.weight = creature.weight ? UTIL.randRange(creature.weight) : null;
        this.value = this.weight * creature.value || null;
        this.image = creature.image;
    }
}

module.exports = Creature;