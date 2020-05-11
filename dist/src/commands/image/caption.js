import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import PImage from "pureimage";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { error, title } from "../../utils";
const defaultDim = [450, 300];
const maxTempImages = 5;
const fontFamily = "impact";
let imgIndex = 1;
let imgPath = path.join(Salty.config.tempImageFolder, `caption_temp_${imgIndex}.png`);
export default new Command({
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
        let imgText = args.length > 0 ? title(args.join(" ").split("\\")) : null;
        if (!Array.isArray(imgText)) {
            imgText = [imgText];
        }
        // First step : find an image and create a canvas from it, or a blank canvas if no image is found.
        if (imgURL) {
            function urlDecode(res) {
                PImage.decodePNGFromStream(res).then((img) => {
                    canvas = PImage.make(img.width, img.height);
                    c = canvas.getContext("2d");
                    c.drawImage(img, 0, 0);
                    textHandler();
                });
            }
            // Chooses from http or https
            imgURL.startsWith("https")
                ? https.get(imgURL, urlDecode)
                : http.get(imgURL, urlDecode);
        }
        else {
            canvas = PImage.make(defaultDim[0], defaultDim[1]);
            c = canvas.getContext("2d");
            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, defaultDim[0], defaultDim[1]);
            textHandler();
        }
        // Second step : apply text on canvas if needed.
        function textHandler() {
            if (imgText[0]) {
                let fontSize = 64;
                let font = PImage.registerFont(`assets/fonts/${fontFamily}.ttf`, fontFamily);
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
                            ? Salty.centerTxtVertical((i == 0 ? 0.1 : 0.9) * canvas.height, metrics)
                            : Salty.centerTxtVertical(canvas.height / 2, metrics);
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
        // Last step : send canvas.
        function sendCanvas() {
            PImage.encodePNGToStream(canvas, fs.createWriteStream(imgPath))
                .then(() => {
                Salty.message(msg, null, imgPath).then(() => {
                    msg.delete();
                    imgIndex =
                        imgIndex >= maxTempImages - 1 ? 1 : imgIndex + 1;
                    imgPath = path.join(Salty.config.tempImageFolder, `caption_temp_${imgIndex}.png`);
                });
            })
                .catch(error);
        }
    },
});
