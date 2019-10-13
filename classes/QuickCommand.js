'use strict';

const Multiton = require('./Multiton');

class QuickCommand extends Multiton {
    constructor(values) {
        super(...arguments);
    }
}

QuickCommand.table = 'commands';
QuickCommand.fields = {
    keys: "",
    effect: "",
    name: ""
};

module.exports = QuickCommand;