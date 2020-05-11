import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import PImage from "pureimage";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { error, title } from "../../utils";

const defaultWidth = 450;
const maxTempImages = 5;
const fontFamily = "helvetica";
const baseFontSize = 24;
const baseLineSpace = 30;
const baseBorder = 10;

let imgIndex = 1;
let imgPath = path.join(
    Salty.config.tempImageFolder,
    `meme_temp_${imgIndex}.png`
);

export default new Command({
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
        let imgText =
            args.length > 0
                ? args
                      .join(" ")
                      .split("\\")
                      .map((line) => title(line))
                : null;

        let imgOffset;

        if (!Array.isArray(imgText)) imgText = [imgText];

        // First step : find an image and create a canvas from it, or a blank canvas if no image is found.
        if (imgURL) {
            function urlDecode(res) {
                PImage.decodePNGFromStream(res).then((img) => {
                    let mult,
                        surface = img.width * img.height;

                    if (surface >= 500000) mult = 3;
                    else if (surface >= 420000) mult = 2.5;
                    else if (surface >= 250000) mult = 2;
                    else if (surface >= 170000) mult = 1.5;
                    else mult = 1;

                    fontSize = baseFontSize * mult;
                    lineSpace = baseLineSpace * mult;
                    border = baseBorder * mult;

                    imgOffset = border * 2 + imgText.length * lineSpace;

                    canvas = PImage.make(img.width, img.height + imgOffset);
                    c = canvas.getContext("2d");

                    c.fillStyle = "#ffffff";
                    c.fillRect(0, 0, img.width, img.height + imgOffset);

                    c.drawImage(img, 0, imgOffset);

                    textHandler();
                });
            }

            // Chooses from http or https
            imgURL.startsWith("https")
                ? https.get(imgURL, urlDecode)
                : http.get(imgURL, urlDecode);
        } else {
            fontSize = baseFontSize;
            lineSpace = baseLineSpace;
            border = baseBorder;

            imgOffset = border * 2 + imgText.length * lineSpace;

            canvas = PImage.make(defaultWidth, imgOffset);
            c = canvas.getContext("2d");

            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, defaultWidth, imgOffset);

            textHandler();
        }
        // Second step : apply text on canvas if needed.
        function textHandler() {
            if (imgText[0]) {
                let font = PImage.registerFont(
                    `assets/fonts/${fontFamily}.ttf`,
                    fontFamily
                );
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
                        c.fillText(
                            imgText[i].trim(),
                            border,
                            border + metrics.emHeightAscent + i * lineSpace
                        );
                    }
                    sendCanvas();
                });
            } else {
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
                        imgPath = path.join(
                            Salty.config.tempImageFolder,
                            `meme_temp_${imgIndex}.png`
                        );
                    });
                })
                .catch(error);
        }
    },
});
