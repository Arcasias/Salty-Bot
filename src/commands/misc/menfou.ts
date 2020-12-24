import fs from "fs";
import { promisify } from "util";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const readDir = promisify(fs.readdir.bind(fs));
const menfouPath = "./assets/img/menfou";

const command: CommandDescriptor = {
  name: "menfou",
  aliases: ["sonic"],
  help: [{ argument: null, effect: "MENFOU" }],
  async action({ msg }) {
    salty.deleteMessage(msg);
    const images = await readDir(menfouPath);
    await salty.message(msg, "", {
      files: images.map((i) => `${menfouPath}/${i}`),
    });
  },
};

export default command;
