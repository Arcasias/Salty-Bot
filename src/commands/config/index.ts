import { CommandCategoryDoc } from "../../types";
import "./blacklist";
import "./channel";
import "./command";
import "./debug";
import "./disconnect";
import "./nickname";
import "./presence";
import "./restart";
import "./role";

const categoryInfo: CommandCategoryDoc = {
    name: "configuration",
    description: "configuration commands used for administration",
    icon: "⚙",
};

export default categoryInfo;
