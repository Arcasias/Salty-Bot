import Formatter from "./classes/Formatter";
import Salty from "./classes/Salty";
import { possessive } from "./utils";

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

const salty = new Salty(formatter);

export default salty;
