"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./blacklist");
require("./channel");
require("./command");
require("./debug");
require("./disconnect");
require("./nickname");
require("./presence");
require("./restart");
require("./role");
const categoryInfo = {
    name: "configuration",
    description: "configuration commands used for administration",
    icon: "⚙",
};
exports.default = categoryInfo;
