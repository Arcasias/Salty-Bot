import { ExpressionDescriptor, ExpressionReplacer } from "../types";
import { possessive } from "../utils";

const FORMAT_REGEX = /<\w+>/g;

class Formatter {
    private expressions: ExpressionDescriptor[] = [];

    public define(expr: RegExp, replacer: ExpressionReplacer): this {
        this.expressions.push({ expr, replacer });
        return this;
    }

    public format(raw: string, context: any): string {
        return raw.replace(FORMAT_REGEX, (match) => {
            const matchExpr = match.slice(1, -1);
            const { replacer } =
                this.expressions.find(({ expr }) => expr.test(matchExpr)) || {};
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
        return match.endsWith("s") ? possessive(displayName) : displayName;
    })
    .define(/mentions?/, (match, ctx) => {
        const { displayName } = ctx.mentions.members.first();
        return match.endsWith("s") ? possessive(displayName) : displayName;
    })
    .define(/targets?/, (match, ctx) => {
        const { displayName } = ctx.mentions.members.first() || ctx.member;
        return match.endsWith("s") ? possessive(displayName) : displayName;
    });

export default formatter;
