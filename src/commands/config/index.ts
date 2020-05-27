import { CommandCategoryDoc } from "../../types";
import "./admin";
import "./blacklist";
import "./command";
import "./debug";
import "./disconnect";
import "./nickname";
import "./presence";
import "./purge";
import "./restart";

const categoryInfo: CommandCategoryDoc = {
    name: "configuration",
    description: "configuration commands used for administration",
    icon: "⚙",
};

export default categoryInfo;
