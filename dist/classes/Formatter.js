"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const FORMAT_REGEX = /<\w+>/g;
class Formatter {
    constructor() {
        this.expressions = [];
    }
    define(expr, replacer) {
        this.expressions.push({ expr, replacer });
        return this;
    }
    format(raw, context) {
        return raw.replace(FORMAT_REGEX, (match) => {
            const matchExpr = match.slice(1, -1);
            const { replacer } = this.expressions.find(({ expr }) => expr.test(matchExpr)) || {};
            if (replacer) {
                return replacer(matchExpr, context);
            }
            return match;
        });
    }
}
const formatter = new Formatter()
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
exports.default = formatter;
