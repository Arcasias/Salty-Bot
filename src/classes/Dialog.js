"use strict";

const Model = require("./Model.js");

const DIALOG_TIMEOUT = 300000;

class Dialog extends Model {
    constructor(origin, response, actions = {}) {
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
        if (react in this.actions) {
            this.actions[react]();
            this.destroy();
        }
    }
}

module.exports = Dialog;
