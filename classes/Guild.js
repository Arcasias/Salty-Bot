'use strict';

const Multiton = require('./Multiton');

class Guild extends Multiton {

    constructor(id) {
        super(...arguments);

        this.id = id;
        this.defaultChannel = null;
        this.defaultRole = null;
        this.favPlaylist = [];
        this.playlist = {};
    }
}

module.exports = Guild;