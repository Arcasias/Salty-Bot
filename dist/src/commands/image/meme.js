"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const pureimage_1 = __importDefault(require("pureimage"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const defaultWidth = 450;
const maxTempImages = 5;
const fontFamily = "helvetica";
const baseFontSize = 24;
const baseLineSpace = 30;
const baseBorder = 10;
let imgIndex = 1;
let imgPath = path_1.default.join(Salty_1.default.config.tempImageFolder, `meme_temp_${imgIndex}.png`);
exports.default = new Command_1.default({
    name: "meme",
    keys: ["memes"],
    help: [
        {
            argument: null,
            effect: "Work in progress",
        },
    ],
    visibility: "public",
    mode: "local",
    async action(msg, args) {
        let canvas, c, fontSize, border, lineSpace;
        const imgURL = msg.attachments.first()
            ? msg.attachments.first().url
            : null;
        let imgText = args.length > 0
            ? args
                .join(" ")
                .split("\\")
                .map((line) => utils_1.title(line))
            : null;
        let imgOffset;
        if (!Array.isArray(imgText))
            imgText = [imgText];
        if (imgURL) {
            function urlDecode(res) {
                pureimage_1.default.decodePNGFromStream(res).then((img) => {
                    let mult, surface = img.width * img.height;
                    if (surface >= 500000)
                        mult = 3;
                    else if (surface >= 420000)
                        mult = 2.5;
                    else if (surface >= 250000)
                        mult = 2;
                    else if (surface >= 170000)
                        mult = 1.5;
                    else
                        mult = 1;
                    fontSize = baseFontSize * mult;
                    lineSpace = baseLineSpace * mult;
                    border = baseBorder * mult;
                    imgOffset = border * 2 + imgText.length * lineSpace;
                    canvas = pureimage_1.default.make(img.width, img.height + imgOffset);
                    c = canvas.getContext("2d");
                    c.fillStyle = "#ffffff";
                    c.fillRect(0, 0, img.width, img.height + imgOffset);
                    c.drawImage(img, 0, imgOffset);
                    textHandler();
                });
            }
            imgURL.startsWith("https")
                ? https_1.default.get(imgURL, urlDecode)
                : http_1.default.get(imgURL, urlDecode);
        }
        else {
            fontSize = baseFontSize;
            lineSpace = baseLineSpace;
            border = baseBorder;
            imgOffset = border * 2 + imgText.length * lineSpace;
            canvas = pureimage_1.default.make(defaultWidth, imgOffset);
            c = canvas.getContext("2d");
            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, defaultWidth, imgOffset);
            textHandler();
        }
        function textHandler() {
            if (imgText[0]) {
                let font = pureimage_1.default.registerFont(`assets/fonts/${fontFamily}.ttf`, fontFamily);
                font.load(() => {
                    c.font = `${fontSize}pt ${fontFamily}`;
                    imgText.forEach((line) => {
                        let metrics = c.measureText(line);
                        while (metrics.width > canvas.width * 0.9) {
                            fontSize -= 2;
                            c.font = `${fontSize}pt ${fontFamily}`;
                            metrics = c.measureText(line);
                        }
                    });
                    for (let i = 0; i < Math.min(imgText.length, 2); i++) {
                        const metrics = c.measureText(imgText[i]);
                        c.fillStyle = "#000000";
                        c.fillText(imgText[i].trim(), border, border + metrics.emHeightAscent + i * lineSpace);
                    }
                    sendCanvas();
                });
            }
            else {
                sendCanvas();
            }
        }
        async function sendCanvas() {
            try {
                await pureimage_1.default.encodePNGToStream(canvas, fs_1.default.createWriteStream(imgPath));
                await Salty_1.default.message(msg, "", { files: [imgPath] });
                msg.delete();
                imgIndex = imgIndex >= maxTempImages - 1 ? 1 : imgIndex + 1;
                imgPath = path_1.default.join(Salty_1.default.config.tempImageFolder, `meme_temp_${imgIndex}.png`);
            }
            catch (err) {
                utils_1.error(err);
            }
        }
    },
});
