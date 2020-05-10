'use strict';

const Multiton = require('./Multiton.js');

class User extends Multiton {
    static get(id) {
        return this.find(user => parseInt(user.discord_id, 10) === parseInt(id));
    }
}
Multiton.table = 'users';
Multiton.fields = {
    discord_id: 0,
    black_listed: false,
    gold: 0,
    xp: 0,
    rank: 0,
    fishingTime: 0,
    fish_count: 0,
    biggest_fish_id: null,
    biggest_fish_weight: 0,
};

module.exports = User;
