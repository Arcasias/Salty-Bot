import {
    Client,
    Guild,
    GuildMember,
    Message,
    TextChannel,
    User
} from "discord.js";
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

/**
 * Setup a test message, along with the following objects:
 *
 * - client: Client
 *
 * - author: User & GuildMember
 *      > client: Client()
 *      > id: "1111111111111111111"
 *
 * - mention: User & GuildMember
 *      > client: Client()
 *      > id: "222222222222222222"
 *
 * - guild: Guild
 *      > client: Client()
 *      > id: "333333333333333333"
 *
 * - channel: TextChannel
 *      > guild: Guild("333333333333333333")
 *      > id: "444444444444444444"
 *      > type: "text"
 *
 * - message: Message
 *      > author: User("1111111111111111111")
 *      > client: Client()
 *      > content: "Test message"
 *      > id: "555555555555555555"
 *      > mentions: [User("222222222222222222")]
 *
 * @param msgData
 * @returns Message("555555555555555555")
 */
function createMockMessage(msgData?: any) {
    const client = new Client();
    const author = new User(client, {
        id: "111111111111111111",
        username: "Author",
    });
    const mention = new User(client, {
        id: "222222222222222222",
        username: "Mention",
    });
    const guild = new Guild(client, {
        id: "333333333333333333",
    });
    guild.members.add(new GuildMember(client, { user: author }, guild));
    guild.members.add(new GuildMember(client, { user: mention }, guild));

    const channel = new TextChannel(guild, {
        id: "444444444444444444",
        type: "text",
    });
    const messageData = Object.assign(
        {
            author,
            content: "Test message",
            id: "555555555555555555",
            mentions: [mention],
        },
        msgData
    );
    return new Message(client, messageData, channel);
}

test("mockMessage", () => {
    const msg = createMockMessage();

    expect(msg.author.id).toBe("111111111111111111");
    expect(msg.mentions.users.first()?.id).toBe("222222222222222222");
    expect(msg.guild?.id).toBe("333333333333333333");
    expect(msg.channel.id).toBe("444444444444444444");
    expect(msg.id).toBe("555555555555555555");
});

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
    const msg = createMockMessage();

    expect(format("<authors> test", msg)).toBe("Author's test");
    expect(format("The test of <author>", msg)).toBe("The test of Author");
    expect(format("<mentions> test", msg)).toBe("Mention's test");
    expect(format("<targets> test", msg)).toBe("Mention's test");

    msg.mentions.members!.delete("222222222222222222");

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
