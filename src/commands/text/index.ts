import { CommandCategoryDoc } from "../../types";
import "./delay";
import "./embed";
import "./interval";
import "./purge";
import "./send";
import "./talk";
import "./tts";

const categoryInfo: CommandCategoryDoc = {
    name: "text",
    description: "Text commands",
    icon: "🗨️",
};

export default categoryInfo;
