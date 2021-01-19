import {
  Client,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from "discord.js";
import {
  apiCatch,
  choice,
  clean,
  ellipsis,
  ensureContent,
  escapeRegex,
  format,
  formatDuration,
  getNumberReactions,
  groupBy,
  isEmpty,
  isSorted,
  levenshtein,
  meaning,
  percent,
  possessive,
  randColor,
  randFloat,
  randInt,
  search,
  shuffle,
  sort,
  stringToReaction,
  title,
} from "../src/utils/generic";

//=============================================================================
// Mock environment
//=============================================================================

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

/**
 * The next two functions are used to patch the "Math.random" method to force
 * the given "num" (with num ∈ [0, 1[) to be returned instead of a random one.
 * Note that "unpatchRandom" must be called at the end of a test in which
 * "patchRandom" was called.
 */
const originalRandom = Math.random.bind(Math);
const patchRandom = (num: number) => (Math.random = () => num);
const unpatchRandom = () => (Math.random = originalRandom);

test("mockMessage", () => {
  const msg = createMockMessage();

  expect(msg.author.id).toBe("111111111111111111");
  expect(msg.mentions.users.first()?.id).toBe("222222222222222222");
  expect(msg.guild?.id).toBe("333333333333333333");
  expect(msg.channel.id).toBe("444444444444444444");
  expect(msg.id).toBe("555555555555555555");
});

//=============================================================================
// Utils tests
//=============================================================================

test("apiCatch", async () => {
  const asyncString = await apiCatch(() => Promise.resolve("async"));
  const asyncError = await apiCatch(() => Promise.reject("Error"));

  expect(asyncString).toBe("async");
  expect(asyncError).toBe(false);
});

test("choice", () => {
  patchRandom(0.1);
  expect(choice([1, 2, 3])).toBe(1);
  patchRandom(0.5);
  expect(choice([1, 2, 3])).toBe(2);
  patchRandom(0.9);
  expect(choice([1, 2, 3])).toBe(3);
  unpatchRandom();
});

test("clean", () => {
  expect(clean("  Test- String ")).toBe("test- string");
});

test("ellipsis", () => {
  const longText = new Array(3000).fill("A").join("");

  expect(ellipsis(longText)).toHaveLength(2000);
  expect(ellipsis(longText, 5)).toBe("A ...");
});

test("ensureContent", () => {
  expect(() => ensureContent(0)).toThrow();
  expect(() => ensureContent(false)).toThrow();
  expect(() => ensureContent("")).toThrow();
  expect(() => ensureContent([])).toThrow();
  expect(() => ensureContent({})).toThrow();

  expect(() => ensureContent(1)).not.toThrow();
  expect(() => ensureContent(true)).not.toThrow();
  expect(() => ensureContent("aaa")).not.toThrow();
  expect(() => ensureContent([false])).not.toThrow();
  expect(() => ensureContent({ a: "x" })).not.toThrow();
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

test("percent", () => {
  patchRandom(0.1);
  expect(percent(10)).toBe(true);
  patchRandom(0.11);
  expect(percent(10)).toBe(false);
  unpatchRandom();
});

test("getNumberReactions", () => {
  expect(getNumberReactions(3)).toEqual(["1️⃣", "2️⃣", "3️⃣"]);
});

test("groupBy", () => {
  expect(groupBy(["bb", "aa", "aaa", "a"], "length")).toEqual({
    1: ["a"],
    2: ["bb", "aa"],
    3: ["aaa"],
  });
  expect(
    groupBy(
      [
        { x: "a", y: "a" },
        { x: "b", y: "a" },
        { x: "a", y: "b" },
      ],
      "x"
    )
  ).toEqual({
    a: [
      { x: "a", y: "a" },
      { x: "a", y: "b" },
    ],
    b: [{ x: "b", y: "a" }],
  });
});

test("isEmpty", () => {
  expect(isEmpty(0)).toBe(true);
  expect(isEmpty("")).toBe(true);
  expect(isEmpty(false)).toBe(true);
  expect(isEmpty([])).toBe(true);
  expect(isEmpty({})).toBe(true);

  expect(isEmpty(1)).toBe(false);
  expect(isEmpty("a")).toBe(false);
  expect(isEmpty(true)).toBe(false);
  expect(isEmpty([0])).toBe(false);
  expect(isEmpty({ a: 0 })).toBe(false);
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

test("possessive", () => {
  expect(possessive("Arcasias")).toBe("Arcasias'");
  expect(possessive("Tyllion")).toBe("Tyllion's");
});

test("randColor", () => {
  expect(randColor()).toMatch(/#[0-9a-f]{6}/);
});

test("randFloat", () => {
  patchRandom(0.1);
  expect(randFloat(3, 5)).toBe(3.2);
  patchRandom(0.5);
  expect(randFloat(3, 5)).toBe(4);
  patchRandom(0.9);
  expect(randFloat(3, 5)).toBe(4.8);
  unpatchRandom();
});

test("randInt", () => {
  patchRandom(0.1);
  expect(randInt(3, 5)).toBe(3);
  patchRandom(0.5);
  expect(randInt(3, 5)).toBe(4);
  patchRandom(0.9);
  expect(randInt(3, 5)).toBe(5);
  unpatchRandom();
});

test("search", () => {
  const array = ["ab", "abc", "bcd"];

  expect(search(array, "a", 1)).toEqual(["ab"]);
  expect(search(array, "a", 2)).toEqual(["ab", "abc"]);
  expect(search(array, "a", 4)).toEqual(array);
});

test("shuffle", () => {
  patchRandom(0.1);
  expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
  patchRandom(0.4);
  expect(shuffle([1, 2, 3])).toEqual([3, 1, 2]);
  patchRandom(0.5);
  expect(shuffle([1, 2, 3])).toEqual([1, 3, 2]);
  patchRandom(0.9);
  expect(shuffle([1, 2, 3])).toEqual([1, 2, 3]);
  unpatchRandom();
});

test("shuffle", () => {
  expect(sort([3, 1, 2])).toEqual([1, 2, 3]);
  expect(sort(["3", "1", "2"])).toEqual(["1", "2", "3"]);
  expect(sort(["c", "a", "b"])).toEqual(["a", "b", "c"]);
  expect(sort(["cc", "aaa", "b"], "length")).toEqual(["b", "cc", "aaa"]);
  expect(sort([{ x: "c" }, { x: "a" }, { x: "b" }], "x")).toEqual([
    { x: "a" },
    { x: "b" },
    { x: "c" },
  ]);
  expect(sort([3, 1, 2], null, false)).toEqual([3, 2, 1]);
});

test("stringToReaction", () => {
  expect(stringToReaction("aaa 1.2")).toEqual(["🇦", "🅰️", "1️⃣", "2️⃣"]);
});

test("title", () => {
  expect(title("arcasias")).toBe("Arcasias");
  expect(title("Arcasias")).toBe("Arcasias");
});
