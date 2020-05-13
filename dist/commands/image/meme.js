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
    async action({ args, msg }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbWFnZS9tZW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBQ3hCLDBEQUErQjtBQUMvQixvRUFBK0Q7QUFDL0QsZ0VBQXdDO0FBQ3hDLHVDQUEyQztBQUMzQyx5Q0FBK0M7QUFFL0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDL0IsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksT0FBTyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsd0JBQWUsRUFBRSxhQUFhLFFBQVEsTUFBTSxDQUFDLENBQUM7QUFFdEUsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQkFBa0I7YUFDN0I7U0FDSixDQUFDO1FBQ0ssU0FBSSxHQUFHLE9BQU8sQ0FBQztJQTJIMUIsQ0FBQztJQXpIRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMs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