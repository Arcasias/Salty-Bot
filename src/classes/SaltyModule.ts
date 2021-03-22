import {
  CallbackDescriptor,
  CategoryDescriptor,
  CategoryId,
  CommandDescriptor,
} from "../typings";
import { log } from "../utils/log";
import Salty from "./Salty";

export default class SaltyModule {
  public callbacks: CallbackDescriptor[] = [
    { method: "load", callback: this.defaultOnLoad },
  ];
  public category: CategoryDescriptor | null = null;
  public commands: { [key in CategoryId]?: CommandDescriptor[] } = {};
  public salty: Salty;

  constructor(salty: Salty) {
    this.salty = salty;
  }

  private defaultOnLoad() {
    const name = this.constructor.name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/ module/i, "");
    log(`${name} module loaded.`);
  }
}
