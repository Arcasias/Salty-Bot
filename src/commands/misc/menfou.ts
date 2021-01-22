import fs from "fs";
import { promisify } from "util";
import { CommandDescriptor } from "../../typings";

const readDir = promisify(fs.readdir.bind(fs));
const menfouPath = "./assets/img/menfou";

const command: CommandDescriptor = {
  name: "menfou",
  aliases: ["sonic"],
  help: [{ argument: null, effect: "MENFOU" }],
  async action({ msg, send }) {
    msg.delete().catch();
    const images = await readDir(menfouPath);
    await send.message("", {
      files: images.map((i) => `${menfouPath}/${i}`),
    });
  },
};

export default command;
