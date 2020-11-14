import { CommandCategoryDoc } from "../../types";
import "./delay";
import "./embed";
import "./interval";
import "./purge";
import "./react";
import "./send";
import "./talk";
import "./tts";
import "./whisper";

const categoryInfo: CommandCategoryDoc = {
    name: "text",
    description: "Text commands",
    icon: "🗨️",
};

export default categoryInfo;
