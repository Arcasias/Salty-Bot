'use strict';

const Multiton = require('./Multiton.js');

class QuickCommand extends Multiton { }
QuickCommand.table = 'commands';
QuickCommand.fields = {
    keys: "",
    effect: "",
    name: ""
};

module.exports = QuickCommand;
