import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { clean } from "../../utils";

const expressions: Map<RegExp, string> = new Map<RegExp, string>([
  // Compound sounds / accents
  [/aa/g, "aー"],
  [/aw|oa/g, "oー"],
  [/kn/g, "n"],
  [/c[ck]/g, "ッk"],
  [/dd/g, "ッd"],
  [/eea?|e[ay]|ii|yy/g, "iー"],
  [/ew|oo|uu/g, "uー"],
  [/ff/g, "f"],
  [/gg/g, "ッgu"],
  [/ll|rr/g, "r"],
  [/o[uw]/g, "aウ"],
  [/pp/g, "ッp"],
  [/ss/g, "s"],
  [/tt/g, "ッt"],
  [/x/g, "クs"],
  // End of word
  [/ge\b/g, "ji"],
  [/ce\b/g, "ス"],
  [/e\b/g, ""],
  // SH
  [/sha/g, "シャ"],
  [/shu/g, "シュ"],
  [/she/g, "シェ"],
  [/sho/g, "ショ"],
  [/sh[iy]?|[sc][iy]/g, "シ"],
  // J
  [/d?ja/g, "ジャ"],
  [/d?ju/g, "ジュ"],
  [/d?[gj]e/g, "ジェ"],
  [/d?jo/g, "ジョ"],
  [/d?(j[iy]?|[gz][iy])/g, "ジ"],
  // CH
  [/t?cha/g, "チャ"],
  [/t?chu/g, "チュ"],
  [/t?che/g, "チェ"],
  [/t?cho/g, "チョ"],
  [/t?ch[iy]?|t[iy]/g, "チ"],
  // K
  [/[ck]a/g, "カ"],
  [/k[iy]/g, "キ"],
  [/ke/g, "ケ"],
  [/[ck]o/g, "コ"],
  [/[ckq]u?/g, "ク"],
  // G
  [/ga/g, "ガ"],
  [/go/g, "ゴ"],
  [/gui/g, "ギ"],
  [/gue/g, "ゲ"],
  [/gu?/g, "グ"],
  // T
  [/ta/g, "タ"],
  [/ts?u/g, "ツ"],
  [/te/g, "テ"],
  [/to?/g, "ト"],
  // S
  [/sa/g, "サ"],
  [/[sc]e/g, "セ"],
  [/so/g, "ソ"],
  [/su?/g, "ス"],
  // Z
  [/za/g, "ザ"],
  [/ze/g, "ゼ"],
  [/zo/g, "ゾ"],
  [/zu?|du/g, "ズ"],
  // D
  [/da/g, "ダ"],
  [/d[iy]/g, "ヂ"],
  [/de/g, "デ"],
  [/do?/g, "ド"],
  // N
  [/na/g, "ナ"],
  [/n[iy]/g, "ニ"],
  [/nu/g, "ヌ"],
  [/ne/g, "ネ"],
  [/no/g, "ノ"],
  [/n/g, "ン"],
  // F/H
  [/[fh]a/g, "ハ"],
  [/[fh]i/g, "ヒ"],
  [/[fh]e/g, "ヘ"],
  [/[fh]o/g, "ホ"],
  [/[fh]u?/g, "フ"],
  // B
  [/[bv]a/g, "バ"],
  [/[bv][iy]/g, "ビ"],
  [/[bv]e/g, "ベ"],
  [/[bv]o/g, "ボ"],
  [/[bv]u?/g, "ブ"],
  // P
  [/pa/g, "パ"],
  [/p[iy]/g, "ピ"],
  [/pe/g, "ペ"],
  [/po/g, "ポ"],
  [/pu?/g, "プ"],
  // M
  [/ma/g, "マ"],
  [/m[iy]/g, "ミ"],
  [/me/g, "メ"],
  [/mo/g, "モ"],
  [/mu?/g, "ム"],
  // R/L
  [/[rl]a/g, "ラ"],
  [/[rl][iy]/g, "リ"],
  [/[rl]e/g, "レ"],
  [/[rl]o/g, "ロ"],
  [/[rl]u?/g, "ル"],
  // W
  [/wa/g, "ワ"],
  [/w[iy]/g, "ウィ"],
  [/wu/g, "ウュ"],
  [/we/g, "ウェ"],
  [/wo/g, "ヲ"],
  // Y/I
  [/[iy]a/g, "ヤ"],
  [/[iy]i/g, "イィ"],
  [/[iy]u/g, "ユ"],
  [/[iy]e/g, "イェ"],
  [/[iy]o/g, "ヨ"],
  // -
  [/a/g, "ア"],
  [/[iy]/g, "イ"],
  [/u/g, "ウ"],
  [/e/g, "エ"],
  [/o/g, "オ"],
  // Remaining (removed)
  [/[wh]/g, ""],
]);

const command: CommandDescriptor = {
  name: "weeb",
  help: [
    {
      argument: "**string**",
      effect: "Roughly translates the given string into japanese katakanas",
    },
  ],
  async action({ args, msg }) {
    let transformed: string = clean(args.join(" "));
    for (const [regex, value] of expressions) {
      transformed = transformed.replace(regex, value);
    }
    if (!transformed.length) {
      transformed = "わからない";
    }
    await salty.message(msg, transformed);
  },
};

export default command;
