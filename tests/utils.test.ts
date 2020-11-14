import {
    choice,
    clean,
    ellipsis,
    escapeRegex,
    format,
    formatDuration,
    generate,
    getNumberReactions,
    isSorted,
    levenshtein,
    meaning,
    pingable,
    possessive,
    randColor,
    randInt,
    search,
    shuffle,
    stringToReaction,
    title,
    toAny
} from "../src/utils";

test("choice", () => {
    const array = [1, 2, 3];

    expect(array).toContain(choice(array));
});

test("clean", () => {
    expect(clean("  Test- String ")).toBe("test- string");
});

test("ellipsis", () => {
    const longText = new Array(3000).fill("A").join("");

    expect(ellipsis(longText)).toHaveLength(2000);
    expect(ellipsis(longText, 5)).toBe("A ...");
});

test("escapeRegex", () => {
    expect(escapeRegex("$()")).toBe("\\$\\(\\)");
});

test("format", () => {
    interface MockMember {
        displayName: string;
    }
    interface MockMessage {
        member: MockMember;
        mentions: { members: { first: () => MockMember | null } };
    }

    const msg: MockMessage = {
        member: { displayName: "Author" },
        mentions: { members: { first: () => ({ displayName: "mention" }) } },
    };

    expect(format("<authors> test", msg)).toBe("Author's test");
    expect(format("The test of <author>", msg)).toBe("The test of Author");
    expect(format("<mentions> test", msg)).toBe("mention's test");
    expect(format("<targets> test", msg)).toBe("mention's test");

    msg.mentions.members.first = () => null;

    expect(format("<targets> test", msg)).toBe("Author's test");
});

test("formatDuration", () => {
    expect(formatDuration(3610000)).toBe("01:00:10");
});

test("generate", () => {
    expect(generate(100)).toBe(true);
    expect(generate(0)).toBe(false);
});

test("getNumberReactions", () => {
    expect(getNumberReactions(3)).toEqual(["1️⃣", "2️⃣", "3️⃣"]);
});

test("isSorted", () => {
    expect(isSorted([1, 2, 3])).toBe(true);
    expect(isSorted([1, 3, 2])).toBe(false);
});

test("levenshtein", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
    expect(levenshtein("abc", "abcd")).toBe(1);
    expect(levenshtein("abcd", "abd")).toBe(1);
    expect(levenshtein("abc", "abd")).toBe(1.5);
});

test("meaning", () => {
    expect(meaning("create")).toBe("add");
    expect(meaning("delete")).toBe("remove");
    expect(meaning("")).toBe(null);
});

test("pingable", () => {
    expect(pingable("1234")).toBe("<@&1234>");
});

test("possessive", () => {
    expect(possessive("Arcasias")).toBe("Arcasias'");
    expect(possessive("Tyllion")).toBe("Tyllion's");
});

test("randColor", () => {
    expect(randColor()).toMatch(/#[0-9a-f]{6}/);
});

test("randInt", () => {
    for (let i = 0; i < 100; i++) {
        const int = randInt(3, 5);

        expect(int).toBeLessThan(5);
        expect(int).toBeGreaterThanOrEqual(3);
    }
});

test("search", () => {
    const array = ["ab", "abc", "bcd"];

    expect(search(array, "a", 1)).toEqual(["ab"]);
    expect(search(array, "a", 2)).toEqual(["ab", "abc"]);
    expect(search(array, "a", 4)).toEqual(array);
});

test("shuffle", () => {
    const array = [1, 2, 3];
    const shuffled = shuffle(array);

    expect(shuffled).toContain(1);
    expect(shuffled).toContain(2);
    expect(shuffled).toContain(3);
});

test("stringToReaction", () => {
    expect(stringToReaction("aaa 1.2")).toEqual(["🇦", "🅰️", "1️⃣", "2️⃣"]);
});

test("title", () => {
    expect(title("arcasias")).toBe("Arcasias");
    expect(title("Arcasias")).toBe("Arcasias");
});

test("toAny", () => {
    expect(toAny("abc")).toBe("abc");
    expect(toAny("null")).toBe(null);
    expect(toAny("undefined")).toBe(undefined);
    expect(toAny("true")).toBe(true);
    expect(toAny("FALSE")).toBe(false);
    expect(toAny("12.3")).toBe(12.3);
});
