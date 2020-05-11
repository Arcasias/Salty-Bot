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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbWFnZS9jYXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNwQixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUM7QUFDL0IsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLENBQUM7QUFDeEMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFM0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUU1QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQzVCLGdCQUFnQixRQUFRLE1BQU0sQ0FDakMsQ0FBQztBQUVGLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDYixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGtCQUFrQjtTQUM3QjtLQUNKO0lBQ0QsVUFBVSxFQUFFLFFBQVE7SUFDcEIsSUFBSSxFQUFFLE9BQU87SUFDYixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJO1FBQ2xCLElBQUksTUFBTSxFQUFFLENBQUMsQ0FB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QUMsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0gsVUFBVSxFQUFFLENBQUM7YUFDaEI7UUFDTCxDQUFDO1FBRUQsMkJBQTJCO1FBQzNCLFNBQVMsVUFBVTtZQUNmLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNQLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUN4QyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRWIsUUFBUTt3QkFDSixRQUFRLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNyRCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDZixLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFDNUIsZ0JBQWdCLFFBQVEsTUFBTSxDQUNqQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCI7XG5pbXBvcnQgaHR0cHMgZnJvbSBcImh0dHBzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IFBJbWFnZSBmcm9tIFwicHVyZWltYWdlXCI7XG5pbXBvcnQgQ29tbWFuZCBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9Db21tYW5kXCI7XG5pbXBvcnQgU2FsdHkgZnJvbSBcIi4uLy4uL2NsYXNzZXMvU2FsdHlcIjtcbmltcG9ydCB7IGVycm9yLCB0aXRsZSB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG5jb25zdCBkZWZhdWx0RGltID0gWzQ1MCwgMzAwXTtcbmNvbnN0IG1heFRlbXBJbWFnZXMgPSA1O1xuY29uc3QgZm9udEZhbWlseSA9IFwiaW1wYWN0XCI7XG5cbmxldCBpbWdJbmRleCA9IDE7XG5sZXQgaW1nUGF0aCA9IHBhdGguam9pbihcbiAgICBTYWx0eS5jb25maWcudGVtcEltYWdlRm9sZGVyLFxuICAgIGBjYXB0aW9uX3RlbXBfJHtpbWdJbmRleH0ucG5nYFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwiY2FwdGlvblwiLFxuICAgIGtleXM6IFtcImNhcFwiXSxcbiAgICBoZWxwOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBudWxsLFxuICAgICAgICAgICAgZWZmZWN0OiBcIldvcmsgaW4gcHJvZ3Jlc3NcIixcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHZpc2liaWxpdHk6IFwicHVibGljXCIsXG4gICAgbW9kZTogXCJsb2NhbFwiLFxuICAgIGFzeW5jIGFjdGlvbihtc2csIGFyZ3MpIHtcbiAgICAgICAgbGV0IGNhbnZhcywgYztcbiAgICAgICAgbGV0IGltZ1VSTCA9IG1zZy5hdHRhY2htZW50cy5maXJzdCgpXG4gICAgICAgICAgICA/IG1zZy5hdHRhY2htZW50cy5maXJzdCgpLnVybFxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBsZXQgaW1nVGV4dCA9XG4gICAgICAgICAgICBhcmdzLmxlbmd0aCA+IDAgPyB0aXRsZShhcmdzLmpvaW4oXCIgXCIpLnNwbGl0KFwiXFxcXFwiKSkgOiBudWxsO1xuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbWdUZXh0KSkge1xuICAgICAgICAgICAgaW1nVGV4dCA9IFtpbWdUZXh0XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcnN0IHN0ZXAgOiBmaW5kIGFuIGltYWdlIGFuZCBjcmVhdGUgYSBjYW52YXMgZnJvbSBpdCwgb3IgYSBibGFuayBjYW52YXMgaWYgbm8gaW1hZ2UgaXMgZm91bmQuXG4gICAgICAgIGlmIChpbWdVUkwpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVybERlY29kZShyZXMpIHtcbiAgICAgICAgICAgICAgICBQSW1hZ2UuZGVjb2RlUE5HRnJvbVN0cmVhbShyZXMpLnRoZW4oKGltZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMgPSBQSW1hZ2UubWFrZShpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBjID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBjLmRyYXdJbWFnZShpbWcsIDAsIDApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRleHRIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDaG9vc2VzIGZyb20gaHR0cCBvciBodHRwc1xuICAgICAgICAgICAgaW1nVVJMLnN0YXJ0c1dpdGgoXCJodHRwc1wiKVxuICAgICAgICAgICAgICAgID8gaHR0cHMuZ2V0KGltZ1VSTCwgdXJsRGVjb2RlKVxuICAgICAgICAgICAgICAgIDogaHR0cC5nZXQoaW1nVVJMLCB1cmxEZWNvZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzID0gUEltYWdlLm1ha2UoZGVmYXVsdERpbVswXSwgZGVmYXVsdERpbVsxXSk7XG4gICAgICAgICAgICBjID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBcIiNmZmZmZmZcIjtcbiAgICAgICAgICAgIGMuZmlsbFJlY3QoMCwgMCwgZGVmYXVsdERpbVswXSwgZGVmYXVsdERpbVsxXSk7XG5cbiAgICAgICAgICAgIHRleHRIYW5kbGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWNvbmQgc3RlcCA6IGFwcGx5IHRleHQgb24gY2FudmFzIGlmIG5lZWRlZC5cbiAgICAgICAgZnVuY3Rpb24gdGV4dEhhbmRsZXIoKSB7XG4gICAgICAgICAgICBpZiAoaW1nVGV4dFswXSkge1xuICAgICAgICAgICAgICAgIGxldCBmb250U2l6ZSA9IDY0O1xuICAgICAgICAgICAgICAgIGxldCBmb250ID0gUEltYWdlLnJlZ2lzdGVyRm9udChcbiAgICAgICAgICAgICAgICAgICAgYGFzc2V0cy9mb250cy8ke2ZvbnRGYW1pbHl9LnR0ZmAsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGZvbnQubG9hZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGMuZm9udCA9IGAke2ZvbnRTaXplfXB0ICR7Zm9udEZhbWlseX1gO1xuXG4gICAgICAgICAgICAgICAgICAgIGltZ1RleHQuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1ldHJpY3MgPSBjLm1lYXN1cmVUZXh0KGxpbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobWV0cmljcy53aWR0aCA+IGNhbnZhcy53aWR0aCAqIDAuOSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplIC09IDI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmZvbnQgPSBgJHtmb250U2l6ZX1wdCAke2ZvbnRGYW1pbHl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRyaWNzID0gYy5tZWFzdXJlVGV4dChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4oaW1nVGV4dC5sZW5ndGgsIDIpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldHJpY3MgPSBjLm1lYXN1cmVUZXh0KGltZ1RleHRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHh0SGVpZ2h0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdUZXh0Lmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBTYWx0eS5jZW50ZXJUeHRWZXJ0aWNhbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGkgPT0gMCA/IDAuMSA6IDAuOSkgKiBjYW52YXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRyaWNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFNhbHR5LmNlbnRlclR4dFZlcnRpY2FsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0cmljc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmZpbGxUZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ1RleHRbaV0udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCAvIDIgLSBtZXRyaWNzLndpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eHRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlVGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdUZXh0W2ldLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggLyAyIC0gbWV0cmljcy53aWR0aCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHh0SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbmRDYW52YXMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VuZENhbnZhcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGFzdCBzdGVwIDogc2VuZCBjYW52YXMuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRDYW52YXMoKSB7XG4gICAgICAgICAgICBQSW1hZ2UuZW5jb2RlUE5HVG9TdHJlYW0oY2FudmFzLCBmcy5jcmVhdGVXcml0ZVN0cmVhbShpbWdQYXRoKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFNhbHR5Lm1lc3NhZ2UobXNnLCBudWxsLCBpbWdQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZy5kZWxldGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1nSW5kZXggPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ0luZGV4ID49IG1heFRlbXBJbWFnZXMgLSAxID8gMSA6IGltZ0luZGV4ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ1BhdGggPSBwYXRoLmpvaW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FsdHkuY29uZmlnLnRlbXBJbWFnZUZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgY2FwdGlvbl90ZW1wXyR7aW1nSW5kZXh9LnBuZ2BcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdfQ==