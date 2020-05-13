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
const config_1 = require("../../config");
const defaultWidth = 450;
const maxTempImages = 5;
const fontFamily = "helvetica";
const baseFontSize = 24;
const baseLineSpace = 30;
const baseBorder = 10;
let imgIndex = 1;
let imgPath = path_1.default.join(config_1.tempImageFolder, `meme_temp_${imgIndex}.png`);
class MemeCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "meme";
        this.keys = ["memes"];
        this.help = [
            {
                argument: null,
                effect: "Work in progress",
            },
        ];
        this.mode = "local";
    }
    async action({ msg, args }) {
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
                imgPath = path_1.default.join(config_1.tempImageFolder, `meme_temp_${imgIndex}.png`);
            }
            catch (err) {
                utils_1.error(err);
            }
        }
    }
}
exports.default = MemeCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbWFnZS9tZW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBQ3hCLDBEQUErQjtBQUMvQixvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUEyQztBQUMzQyx5Q0FBK0M7QUFFL0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDL0IsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksT0FBTyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsd0JBQWUsRUFBRSxhQUFhLFFBQVEsTUFBTSxDQUFDLENBQUM7QUFFdEUsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQkFBa0I7YUFDN0I7U0FDSixDQUFDO1FBQ0ssU0FBSSxHQUFHLE9BQU8sQ0FBQztJQTJIMUIsQ0FBQztJQXpIRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixJQUFJLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FB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