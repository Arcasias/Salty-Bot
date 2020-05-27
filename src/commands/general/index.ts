import { CommandCategoryDoc } from "../../types";
import "./delay";
import "./embed";
import "./help";
import "./interval";
import "./ping";
import "./state";
import "./talk";
import "./todo";

const categoryInfo: CommandCategoryDoc = {
    name: "general",
    description: "basic commands",
    icon: "📁",
};

export default categoryInfo;
