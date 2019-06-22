'use strict';

const Multiton = require('./Multiton');
const DIALOG_TIMEOUT = 300000;

class Dialog extends Multiton {

    constructor(origin, response, actions={}) {
        super(...arguments);

        this.origin = origin;
        this.author = this.origin.author;
        this.response = response;
        this.actions = actions;
        this.timeOut = setTimeout(() => {
            this.timeOut = null;
            this.destroy();
        }, DIALOG_TIMEOUT);
    }

    run(react) {
        if (this.actions[react]) {
            this.actions[react]();
            this.destroy();
        }
    }
}

module.exports = Dialog;