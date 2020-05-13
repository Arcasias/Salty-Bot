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
    async action({ msg, args }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbWFnZS9jYXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsZ0RBQXdCO0FBQ3hCLDBEQUErQjtBQUMvQixvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUEyQztBQUMzQyx5Q0FBK0M7QUFFL0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUU1QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyx3QkFBZSxFQUFFLGdCQUFnQixRQUFRLE1BQU0sQ0FBQyxDQUFDO0FBRXpFLFNBQVMsaUJBQWlCLENBQ3RCLENBQVMsRUFDVCxPQUFpQztJQUVqQyxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLGNBQWUsU0FBUSxpQkFBTztJQUFwQzs7UUFDVyxTQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2pCLFNBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGtCQUFrQjthQUM3QjtTQUNKLENBQUM7UUFDSyxTQUFJLEdBQUcsT0FBTyxDQUFDO0lBMkcxQixDQUFDO0lBekdHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNkLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUc7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNYLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFHeEUsSUFBSSxNQUFNLEVBQUU7WUFDUixTQUFTLFNBQVMsQ0FBQyxHQUFHO2dCQUNsQixtQkFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUN6QyxNQUFNLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzVDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU1QixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXZCLFdBQVcsRUFBRSxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztnQkFDOUIsQ0FBQyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDSCxNQUFNLEdBQUcsbUJBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVCLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFL0MsV0FBVyxFQUFFLENBQUM7U0FDakI7UUFHRCxTQUFTLFdBQVc7WUFDaEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixJQUFJLElBQUksR0FBRyxtQkFBTSxDQUFDLFlBQVksQ0FDMUIsZ0JBQWdCLFVBQVUsTUFBTSxFQUNoQyxVQUFVLENBQ2IsQ0FBQztnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDWCxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsUUFBUSxNQUFNLFVBQVUsRUFBRSxDQUFDO29CQUV2QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRWxDLE9BQU8sT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRTs0QkFDdkMsUUFBUSxJQUFJLENBQUMsQ0FBQzs0QkFFZCxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsUUFBUSxNQUFNLFVBQVUsRUFBRSxDQUFDOzRCQUN2QyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDakM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbEQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsTUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDOzRCQUNkLENBQUMsQ0FBQyxpQkFBaUIsQ0FDYixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFDcEMsT0FBTyxDQUNWOzRCQUNILENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFFeEQsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUNqQixNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsRUFDcEMsU0FBUyxDQUNaLENBQUM7d0JBRUYsQ0FBQyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7d0JBQzFCLENBQUMsQ0FBQyxVQUFVLENBQ1IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUNqQixNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsRUFDcEMsU0FBUyxDQUNaLENBQUM7cUJBQ0w7b0JBQ0QsVUFBVSxFQUFFLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0gsVUFBVSxFQUFFLENBQUM7YUFDaEI7UUFDTCxDQUFDO1FBR0QsS0FBSyxVQUFVLFVBQVU7WUFDckIsSUFBSTtnQkFDQSxNQUFNLG1CQUFNLENBQUMsaUJBQWlCLENBQzFCLE1BQU0sRUFDTixZQUFFLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQ2hDLENBQUM7Z0JBQ0YsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFYixRQUFRLEdBQUcsUUFBUSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDNUQsT0FBTyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQ2Ysd0JBQWUsRUFDZixnQkFBZ0IsUUFBUSxNQUFNLENBQ2pDLENBQUM7YUFDTDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNkO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGNBQWMsQ0FBQyJ9