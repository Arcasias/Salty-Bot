'use strict';

const config = require('../data/config.json');
const Multiton = require('./Multiton');

class User extends Multiton {

    constructor(id) {
        super(...arguments);

        this.id = id;
        this.gold = 0;
        this.xp = 0;
        this.rank = 0;
        this.fishes = [];
        this.fishingTime = 0;
        this.fishCount = 0;
        this.bestFish = null;
        this.inventory = [config.defaultRod];
        this.equipped = { rod: config.defaultRod };
        this.todo = [];
    }
}

module.exports = User;