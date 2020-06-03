import { CommandCategoryDoc } from "../../types";
import "./join";
import "./leave";
import "./pause";
import "./play";
import "./queue";
import "./repeat";
import "./resume";
import "./shuffle";
import "./skip";
import "./stop";

const categoryInfo: CommandCategoryDoc = {
    name: "music",
    description: "musical commands",
    icon: "🎵",
};

export default categoryInfo;
