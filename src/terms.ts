import { Dictionnary, Joke, MeaningInfo, Meanings, Waifu } from "./typings";

//=============================================================================
// Meanings
//=============================================================================

export const keywords: Meanings = {
  add: ["add", "append", "create", "push", "link"],
  bot: ["bot", "salty"],
  default: ["default", "def"],
  clear: ["clear", "cls", "empty", "cancel", "stop"],
  help: [
    "help",
    "halp",
    "info",
    "infos",
    "information",
    "wtf",
    "?",
    "doc",
    "documentation",
    "manual",
    "man",
  ],
  list: ["list", "ls", "l"],
  remove: ["delete", "remove", "del", "rm", "erase", "unset", "unlink"],
  set: ["set", "modify", "mod", "update"],
};
export const meaning: Dictionnary<MeaningInfo> = {
  yes: {
    answers: ["ack"],
    list: ["yes", "yeah", "yee", "yep", "yup", "affirmative"],
  },
  no: {
    answers: ["ack"],
    list: ["no", "nooo", "nope", "nooope", "negative"],
  },
  hello: {
    answers: ["greet"],
    list: [
      "hi",
      "hello",
      "yo",
      "howdy",
      "sup",
      "whats up",
      "greetings",
      "ohayo",
      "hey",
    ],
  },
  goodbye: {
    answers: ["bye"],
    list: ["cya", "see you", "bye", "goodbye", "farewell", "so long"],
  },
  thanks: {
    answers: ["ackthank"],
    list: ["thanks", "thx", "grateful"],
  },
  welcome: {
    answers: ["thank"],
    list: ["welcome"],
  },
  sorry: {
    answers: ["acksorry"],
    list: ["sorry", "excuse me", "excuses", "apologies"],
  },
  ok: {
    answers: ["yes"],
    list: ["ok", "clear", "understood", "got it"],
  },
  howAreYou: {
    answers: ["fine", "thank"],
    list: [
      "how are you",
      "how are you doing",
      "how do you do",
      "are you good",
      "are you fine",
      "are you ok",
      "how you doing",
      "what's up",
      "waddup",
      "whassup",
    ],
  },
  badWord: {
    answers: ["rude"],
    list: [
      "fuck",
      "fucker",
      "fucking",
      "dick",
      "cock",
      "twat",
      "cunt",
      "ass",
      "boobs",
      "wank",
      "wanker",
      "suck",
      "sucks",
      "stfu",
      "gtfo",
    ],
  },
};

//=============================================================================
// Answers
//=============================================================================

export const answers: Dictionnary<string[]> = {
  yes: ["yes", "yeah", "of course", "affirmative", "yup", "definitely"],
  no: ["no", "nope", "absolutely no"],
  greet: ["hi", "hello", "yo", "howdy", "hey", "hey there", "greetings"],
  bye: [
    "goodbye",
    "see you",
    "see you later",
    "bye",
    "bye bye",
    "so long",
    "farewell",
  ],
  thank: ["thanks", "thank you"],
  ackthank: [
    "you're welcome",
    "you are welcome",
    "you're very welcome",
    "you are very welcome",
    "you're whale cum",
    "well that was nothing really",
  ],
  sorry: [
    "sorry",
    "I'm sorry",
    "I'm so sorry",
    "I'm really sorry",
    "my apologies",
    "apologies",
  ],
  acksorry: ["it's ok", "it's okay", "I don't mind", "apologies accepted"],
  laugh: [
    "HAHAHAHAHA",
    "AYYY LMAO",
    "LMAO",
    "HAHAHAHAHA LOL",
    "LOOOOOOOL",
    "OMFG xD",
    "HAHAHAHA",
  ],
  ack: ["got it", "I've got it", "ok", "okay", "alright", "understood", "sure"],
  fine: ["fine", "I'm fine", "good", "I'm good"],
  rand: [
    "busy right now but... \\*sigh\\* what do yo want?",
    "can you repeat? That'd be so lovely",
    "<catch phrase>",
    "do I know you?",
    "either you're talking to me, or you just messed up a command",
    "for your information, I have a monkeysort command that is ABSOLUTELY useless",
    "hey I have other things to do ok?",
    "hey, you know, I'm a bot... that's AWESOME right?",
    "hmmm",
    "huh?",
    "I hate you",
    "I love you",
    "I'm vegan",
    "I used to be a knee like you, then I took an adventurer to the arrow",
    "I used to be an adventurer like you, then I took an arrow to the knee",
    "I used to be an arrow like you, then I took an knee to the adventurer",
    "it looks like you're... talking to me?",
    "just for your information, I'm not actually made of salt. I'm 100% TypeScript ;)",
    "maybe the Earth is flat after all",
    "oh, are you trying to talk to me?",
    "oh, hello human",
    "oh hey, didn't notice you there",
    "yes?",
    "you'll choke to death on 3 pounds of steel",
    "you should try to say that the other way around",
    "yup, still there",
  ],
  say: ["say", "do"],
  smiley: ["^-^", "^3^", ":D", ";D", ":3", ";)", ":p", "♥"],
  rude: [
    "language",
    "watch your language",
    "watch your mouth",
    "that was not nice",
    "you really kiss your mother with that mouth?",
    "you're that pathetic that you have to use such words to express yourself?",
    "you better talk nice to me",
    "you know I can swear too",
    "you sure you're old enough to use that word?",
  ],
};
export const help: string[] = [
  "Hello! Try `$help` to see what I'm capable of!",
  "Hi! If you need anything try typing `$help`!",
  "Hey there! Type `$help` if you need anything!",
];
export const intro: string[] = [
  "did you miss me?",
  "here I come to salt the day!",
  "surprise, I'm back!",
  "your favorite bot is back online!",
  "powered up and ready to salt!",
  "IT'S ME BOIIIIS",
  "mmmmh... looks like there's a serious lack of salt here!",
  "I have been reborn!",
  "looks like you're getting bored without me ;)",
  "oh sweet, a whole server to fill with salt!",
  "all aboard the salt train!",
];
export const jokes: Joke[] = [
  { text: "your life" },
  { text: "the current Bitcoin value" },
  { text: "well your life is a joke anyway" },
  { text: "a blind man walks into a bar, a chair, the waitress..." },
  {
    text: "I don't like jokes about german sausages. They really are the wurst",
  },
  {
    text:
      "two routers decided to marry. The wedding wasn't much, but the reception was incredible",
  },
  {
    text: "what's the hardest part in a vegetable?",
    answer: "The wheelchair",
  },
  {
    text: "how do you make a clown cry?",
    answer: "By killing his whole family",
  },
  {
    text: "how do you make a plumber cry?",
    answer: "By killing his whole family",
  },
  {
    text: "why do crabs never give to charity?",
    answer: "Because they're shellfish",
  },
  {
    text: "why did the chicken cross the road?",
    answer: "Because you touch yourself at night",
  },
  {
    text: "why aren't Microsoft developers wearing glasses?",
    answer: "Because they can C sharp",
  },
  {
    text: "what did the triceratops say to the dimetrodon?",
    answer: "Nothing. They lived at different epochs",
  },
];
export const pureSalt: string[] = [
  "you're a complete retard",
  "you're retarded as fuck",
  "kill yourself",
  "what the fuck is wrong with you?",
  "you should definitely kill yourself",
  "you're definitely retarded",
  "LMAO you're dumb as shit",
  "get a life",
  "you really aren't smart, are you?",
  "are you retarded?",
  "autistic fuck",
  "you're just bad",
  "what's the point of you?",
  "try killing yourself next time",
  "I hope you step on a lego",
  "end your pathetic life",
  "have you already considered suicide?",
  "please don't reproduce",
  "please use condoms",
  "I hope you're using condoms",
  "don't breed. Please",
  "and when exactly are you planning to die?",
  "please die",
  "considered suicide already? You should try it",
  "please do me a favor and jump off a rooftop",
  "looks like your age matches your IQ",
  "I don't have the time nor the crayons to explain how dumb you are",
  'I wrote you a poem, it goes like this: "Roses are red, go fuck yourself"',
];

//=============================================================================
// Other
//=============================================================================

export const fault: Dictionnary<string[]> = {
  start: [
    "",
    "want to know why you lost? ",
    "isn't it obvious? ",
    "I think it was pretty clear ",
  ],
  sentence: [
    "It was **<subject>**'s fault for <reason>. The punishment will be <punishment>",
    "You lost because **<subject>** was <reason> again. Sanction will be <punishment>",
    "Just ask **<subject>** to think twice before <reason>. This time the sentence will just be <punishment>",
  ],
  subject: [
    "Antoine",
    "Dorian",
    "Florent",
    "Julien",
    "Martin",
    "Ophélie",
    "that random pickup",
    "your mom",
  ],
  reason: [
    "not providing enough healing",
    "not healing you enough",
    "repeatedly committing suicide",
    "troll picking",
    "flaming",
    "toxic behaviour",
    "extremely toxic behaviour",
    "being a complete ass throughout the entire game",
    "picking Genji",
    "not taking a good counterpick",
    "saying the N-word",
    "constantly rushing head down into unnessecary fights",
    "being good while no one else was",
    "not knowing his own hero abilities",
    "not knowing how to play",
    "constantly crying",
    "being a pessimistic ass",
    "whining all the time",
  ],
  punishment: [
    "death",
    "seppuku",
    "sudoku",
    "an apple in the ass",
    "a bunch of apples in the ass",
    "a warning. It's ok for this time",
    "a pat on the head. At least it was well performed",
    "uninstalling Overwatch",
    "being assraped by a gang of 8 strong N-words",
  ],
};
export const predictions: string[] = [
  "changer de sexe",
  "cuisiner avec Raph",
  "cuisiner Raph",
  "chier sur la voiture de Killian",
  "devenir l'esclave de Valerr",
  "devenir président des îles vierges",
  "émasculer Louis",
  "envoyer une photo d'orteils à Julien",
  "faire du surf avec Thu Lan",
  "faire une julienne de Julien",
  "jouer aux échecs",
  "manger une glace",
  "obtenir un rat",
  "offrir des chaussures à Louis",
  "offrir des paquets à Killian",
  "préparer des crêpes",
  "ramener Thu Lan en bronze 4",
  "résoudre des équations",
  "ruiner le TFE de Valerr",
  "se faire écraser",
  "se faire tabasser par Madi",
  "sortir avec un noir",
  "tomber en dépression",
  "tondre Madi",
];
export const surpriseSong: string[] = [
  "https://www.youtube.com/watch?v=pjepDoTUvAI",
  "https://www.youtube.com/watch?v=Q3E7L_RoyTU",
  "https://www.youtube.com/watch?v=ShCBna7Eg1Q",
  "https://www.youtube.com/watch?v=6ua6OahzdwQ",
  "https://www.youtube.com/watch?v=FLdFL3TNoDo",
];
export const transactionSuccess: string[] = [
  "A pleasure to make business with you",
  "Come back anytime",
  "Hope to see you soon",
];

export const waifus: Waifu[] = [
  {
    name: "Rory Mercury",
    anime: "Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
    image: [
      "http://img04.deviantart.net/c9a8/i/2015/227/7/8/rory_mercury__vectorised_super_hd__by_jaytec359-d95qpdn.png",
      "https://i.pinimg.com/originals/ee/f0/b1/eef0b188f21037529c2b23b263333664.jpg",
      "https://i.pinimg.com/736x/c0/55/88/c05588ea6dbda73d46fbf031e858d324.jpg",
      "http://pre05.deviantart.net/3a9e/th/pre/i/2015/221/e/0/rory_mercury_by_ryuudog-d94wz89.jpg",
    ],
  },
  {
    name: "Kurumi Tokisaki",
    anime: "Date A Live",
    image: [
      "https://i.pinimg.com/originals/a5/8f/87/a58f876c8821d04ce257ed8ba6963f73.png",
      "https://kazasou.files.wordpress.com/2013/11/konachan-com-171295-black_hair-choker-cleavage-date_a_live-dress-garter_belt-gun-halloween-headdress-long_hair-red_eyes-ribbons-roland-gin-thighhighs-weapon-yellow_eyes.jpg",
      "http://orig13.deviantart.net/78e0/f/2014/029/8/d/tokisaki_kurumi_by_pmazzuco-d749f3f.png",
      "https://static.zerochan.net/Tokisaki.Kurumi.full.1718175.jpg",
    ],
  },
  {
    name: "Megumin",
    anime: "Kono Subarashii Sekai ni Shukufuku wo!",
    image: [
      "https://static.zerochan.net/Megumin.%28KonoSuba%29.full.1986667.jpg",
      "https://static.zerochan.net/Megumin.full.1984357.jpg",
      "https://static.zerochan.net/Megumin.(KonoSuba).full.1978894.jpg",
      "http://i1.kym-cdn.com/photos/images/original/001/207/257/f88.jpg",
    ],
  },
  {
    name: "Rem",
    anime: "Re:Zero kara Hajimeru Isekai Seikatsu",
    image: [
      "https://i.pinimg.com/736x/95/58/74/955874e519e919f91d93a4b085f1c582.jpg",
      "https://thehypedgeek.com/wp-content/uploads/2017/04/rem-re-zero.jpg",
    ],
  },
  {
    name: "Yoko Littner",
    anime: "Tengen Toppa Gurren Lagann",
    image: [
      "https://cdn.wallpapersafari.com/85/73/6qLG2g.jpg",
      "https://www.pngkit.com/png/detail/168-1683809_5-yoko-littner-gurren-lagann-yoko-gurren-lagann.png",
      "https://vignette.wikia.nocookie.net/characterprofile/images/0/01/Yoko.png/revision/latest/scale-to-width-down/340?cb=20160325102505",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcThX3ygaEWdwFsyvhKyoFjZx8AQFMF2cvovkmLZg4H8zTo2yW4T&usqp=CAU",
    ],
  },
  {
    name: "Trash",
    anime: "Your life",
    image: [
      "https://www.stickpng.com/assets/images/5c41d448e39d5d01c21da912.png",
      "https://i.ya-webdesign.com/images/piles-of-garbage-png-5.png",
    ],
  },
];
