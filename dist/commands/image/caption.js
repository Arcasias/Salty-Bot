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
const defaultDim = [450, 300];
const maxTempImages = 5;
const fontFamily = "impact";
let imgIndex = 1;
let imgPath = path_1.default.join(config_1.tempImageFolder, `caption_temp_${imgIndex}.png`);
function centerTxtVertical(y, metrics) {
    return y;
}
class CaptionCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "caption";
        this.keys = ["cap"];
        this.help = [
            {
                argument: null,
                effect: "Work in progress",
            },
        ];
        this.mode = "local";
    }
    async action({ args, msg }) {
        let canvas, c;
        let imgURL = msg.attachments.first()
            ? msg.attachments.first().url
            : null;
        const imgText = args.length ? args.join(" ").split("\\") : [];
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
                imgPath = path_1.default.join(config_1.tempImageFolder, `caption_temp_${imgIndex}.png`);
            }
            catch (err) {
                utils_1.error(err);
            }
        }
    }
}
exports.default = CaptionCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbWFnZS9jYXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBQ3hCLDBEQUErQjtBQUMvQixvRUFBK0Q7QUFDL0QsZ0VBQXdDO0FBQ3hDLHVDQUEyQztBQUMzQyx5Q0FBK0M7QUFFL0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUU1QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyx3QkFBZSxFQUFFLGdCQUFnQixRQUFRLE1BQU0sQ0FBQyxDQUFDO0FBRXpFLFNBQVMsaUJBQWlCLENBQ3RCLENBQVMsRUFDVCxPQUFpQztJQUVqQyxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLGNBQWUsU0FBUSxpQkFBTztJQUFwQzs7UUFDVyxTQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2pCLFNBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGtCQUFrQjthQUM3QjtTQUNKLENBQUM7UUFDSyxTQUFJLEdBQUcsT0FBTyxDQUFDO0lBMkcxQixDQUFDO0lBekdHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDZCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNoQyxDQUFDLENBQUMs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