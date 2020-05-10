"use strict";

const Model = require("./Model.js");

class QuickCommand extends Model {}
QuickCommand.table = "commands";
QuickCommand.fields = {
    keys: "",
    effect: "",
    name: "",
};

module.exports = QuickCommand;
