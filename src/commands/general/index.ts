import { CommandCategoryDoc } from "../../types";
import "./admin";
import "./announcement";
import "./help";
import "./music";
import "./ping";
import "./poll";
import "./state";
import "./todo";

const categoryInfo: CommandCategoryDoc = {
  name: "general",
  description: "basic commands",
  icon: "📁",
};

export default categoryInfo;
