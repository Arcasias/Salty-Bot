'use strict';

const Multiton = require('./Multiton');

class Guild extends Multiton {
    static get(id) {
        return this.find(guild => parseInt(guild.discord_id, 10) === parseInt(id));
    }
}

Guild.table = 'guilds';
Guild.fields = {
    discord_id: 0,
    default_channel: null,
    default_role: null,
};

module.exports = Guild;