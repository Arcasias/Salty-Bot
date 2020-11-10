import Salty from "./classes/Salty";
import Core from "./modules/Core";
import Seum from "./modules/Seum";

const salty = new Salty();

salty.registerModule(Seum);
salty.registerModule(Core);

export default salty;
