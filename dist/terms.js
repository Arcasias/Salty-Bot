"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = [
    "add",
    "append",
    "create",
    "push",
    "set",
    "mod",
    "modify",
    "update",
];
exports.remove = ["delete", "remove", "del", "rm", "erase", "unset"];
exports.clear = ["clear", "cls", "empty", "cancel", "stop"];
exports.help = ["help", "halp", "info", "infos", "wtf", "?"];
exports.list = ["list", "ls", "l"];
exports.bot = ["bot", "salty"];
exports.buy = ["buy", "buying", "wtb"];
exports.sell = ["sell", "selling", "wts"];
exports.intro = [
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
exports.meaning = {
    yes: {
        answers: ["ack"],
        list: ["yes", "yeah", "yea", "yee", "yep", "yup", "affirmative"],
    },
    no: {
        answers: ["ack"],
        list: ["no", "noo", "nooo", "nope", "noope", "nooope", "negative"],
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
            "heyo",
            "ohayo",
        ],
    },
    goodbye: {
        answers: ["bye"],
        list: [
            "cya",
            "see ya",
            "see you",
            "bye",
            "goodbye",
            "farewell",
            "so long",
        ],
    },
    thanks: {
        answers: ["ackthank"],
        list: ["thanks", "thank", "thx", "grateful"],
    },
    welcome: {
        answers: ["thank"],
        list: ["welcome"],
    },
    sorry: {
        answers: ["acksorry"],
        list: ["sorry", "excuse", "excuses", "apologie", "apologies"],
    },
    ok: {
        answers: ["yes"],
        list: [
            "ok",
            "okay",
            "clear",
            "understand",
            "understood",
            "get it",
            "got it",
        ],
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
            "how you doin",
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
exports.answers = {
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
    ack: [
        "got it",
        "I've got it",
        "ok",
        "okay",
        "alright",
        "understood",
        "sure",
    ],
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
        "i hate you",
        "i love you",
        "I'm vegan",
        "I used to be a knee like you, then I took an adventurer to the arrow",
        "I used to be an adventurer like you, then I took an arrow to the knee",
        "I used to be an arrow like you, then I took an knee to the adventurer",
        "it looks like you're... talking to me?",
        "just for your information, I'm not actually made of salt. I'm 100% JavaScript ;)",
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
exports.jokes = [
    "your life",
    "the current Bitcoin value",
    "well your life is a joke anyway",
    "a blind man walks into a bar, a chair, the waitress...",
    "i don't like jokes about german sausages. They really are the wurst",
    "two routers decided to marry. The wedding wasn't much, but the reception was incredible",
    "what's the hardest part in a vegetable?\n\n\nThe wheelchair",
    "how do you make a clown cry?\n\n\nBy killing his whole family",
    "how do you make a plumber cry?\n\n\nBy killing his whole family",
    "why do crabs never give to charity?\n\n\nBecause they're shellfish",
    "why did the chicken cross the road?\n\n\nBecause you touch yourself at night",
    "why aren't Microsoft developers wearing glasses?\n\n\nBecause they can C sharp",
    "what did the triceratops say to the dimetrodon?\n\n\nNothing. They lived at different epochs",
];
exports.pureSalt = [
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
    "i hope you step on a lego",
    "end your pathetic life",
    "have you already considered suicide?",
    "please don't reproduce",
    "please use condoms",
    "i hope you're using condoms",
    "don't breed. Please",
    "and when exactly are you planning to die?",
    "please die",
    "considered suicide already? You should try it",
    "please do me a favor and jump off a rooftop",
    "looks like your age matches your IQ",
    "i don't have the time nor the crayons to explain how dumb you are",
    'i wrote you a poem, it goes like this: "Roses are red, go fuck yourself"',
];
exports.surpriseSong = [
    "https://www.youtube.com/watch?v=pjepDoTUvAI",
    "https://www.youtube.com/watch?v=Q3E7L_RoyTU",
    "https://www.youtube.com/watch?v=ShCBna7Eg1Q",
    "https://www.youtube.com/watch?v=6ua6OahzdwQ",
    "https://www.youtube.com/watch?v=FLdFL3TNoDo",
];
exports.waifus = [
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
        anime: "Konosuba",
        image: [
            "https://static.zerochan.net/Megumin.%28KonoSuba%29.full.1986667.jpg",
            "https://static.zerochan.net/Megumin.full.1984357.jpg",
            "https://static.zerochan.net/Megumin.(KonoSuba).full.1978894.jpg",
            "http://i1.kym-cdn.com/photos/images/original/001/207/257/f88.jpg",
        ],
    },
];
exports.transactionSuccess = [
    "A pleasure to make business with you",
    "Come back anytime",
    "Hope to see you soon",
];
exports.fault = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLEdBQUcsR0FBRztJQUNmLEtBQUs7SUFDTCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLFFBQVE7SUFDUixRQUFRO0NBQ1gsQ0FBQztBQUNXLFFBQUEsTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxRQUFBLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRCxRQUFBLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckQsUUFBQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFFBQUEsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZCLFFBQUEsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvQixRQUFBLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLEdBQUc7SUFDakIsa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUM5QixxQkFBcUI7SUFDckIsbUNBQW1DO0lBQ25DLCtCQUErQjtJQUMvQixpQkFBaUI7SUFDakIsMERBQTBEO0lBQzFELHFCQUFxQjtJQUNyQiwrQ0FBK0M7SUFDL0MsNkNBQTZDO0lBQzdDLDRCQUE0QjtDQUMvQixDQUFDO0FBQ1csUUFBQSxPQUFPLEdB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