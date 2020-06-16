"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Formatter_1 = __importDefault(require("./classes/Formatter"));
const Salty_1 = __importDefault(require("./classes/Salty"));
const utils_1 = require("./utils");
const formatter = new Formatter_1.default()
    .define(/authors?/, (match, ctx) => {
    const { displayName } = ctx.member;
    return match.endsWith("s") ? utils_1.possessive(displayName) : displayName;
})
    .define(/mentions?/, (match, ctx) => {
    const { displayName } = ctx.mentions.members.first();
    return match.endsWith("s") ? utils_1.possessive(displayName) : displayName;
})
    .define(/targets?/, (match, ctx) => {
    const { displayName } = ctx.mentions.members.first() || ctx.member;
    return match.endsWith("s") ? utils_1.possessive(displayName) : displayName;
});
const salty = new Salty_1.default(formatter);
exports.default = salty;
