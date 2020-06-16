import { ExpressionDescriptor, ExpressionReplacer } from "../types";

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

export default Formatter;
