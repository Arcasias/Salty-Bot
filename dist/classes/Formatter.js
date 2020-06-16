"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Formatter;
