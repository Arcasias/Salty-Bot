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
const defaultDim = [450, 300];
const maxTempImages = 5;
const fontFamily = "impact";
let imgIndex = 1;
let imgPath = path_1.default.join(Salty_1.default.config.tempImageFolder, `caption_temp_${imgIndex}.png`);
function centerTxtVertical(y, metrics) {
    return y;
}
exports.default = new Command_1.default({
    name: "caption",
    keys: ["cap"],
    help: [
        {
            argument: null,
            effect: "Work in progress",
        },
    ],
    visibility: "public",
    mode: "local",
    async action(msg, args) {
        let canvas, c;
        let imgURL = msg.attachments.first()
            ? msg.attachments.first().url
            : null;
        let imgText = args.length > 0 ? utils_1.title(args.join(" ").split("\\")) : null;
        if (!Array.isArray(imgText)) {
            imgText = [imgText];
        }
        if (imgURL) {
            function urlDecode(res) {
                pureimage_1.default.decodePNGFromStream(res).then((img) => {
                    canvas = pureimage_1.default.make(img.width, img.height);
                    c = canvas.getContext("2d");
                    c.drawImage(img, 0, 0);
                    textHandler();
                });
            }
            imgURL.startsWith("https")
                ? https_1.default.get(imgURL, urlDecode)
                : http_1.default.get(imgURL, urlDecode);
        }
        else {
            canvas = pureimage_1.default.make(defaultDim[0], defaultDim[1]);
            c = canvas.getContext("2d");
            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, defaultDim[0], defaultDim[1]);
            textHandler();
        }
        function textHandler() {
            if (imgText[0]) {
                let fontSize = 64;
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
                        const txtHeight = imgText.length > 1
                            ? centerTxtVertical((i == 0 ? 0.1 : 0.9) * canvas.height, metrics)
                            : centerTxtVertical(canvas.height / 2, metrics);
                        c.fillStyle = "#ffffff";
                        c.fillText(imgText[i].trim(), canvas.width / 2 - metrics.width / 2, txtHeight);
                        c.strokeStyle = "#000000";
                        c.strokeText(imgText[i].trim(), canvas.width / 2 - metrics.width / 2, txtHeight);
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
                imgPath = path_1.default.join(Salty_1.default.config.tempImageFolder, `caption_temp_${imgIndex}.png`);
            }
            catch (err) {
                utils_1.error(err);
            }
        }
    },
});
