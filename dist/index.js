"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Salty_1 = __importDefault(require("./classes/Salty"));
require("./commands");
const config_1 = require("./config");
const utils_1 = require("./utils");
if (process.env.SERVER) {
    process.env.MODE = "server";
}
utils_1.log(`Running on ${process.env.MODE} environment`);
process.env.DEBUG = String(config_1.debugMode);
utils_1.debug(`Debug is active`);
Salty_1.default.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsc0JBQW9CO0FBQ3BCLHFDQUFxQztBQUNyQyxtQ0FBcUM7QUFHckMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7Q0FDL0I7QUFDRCxXQUFHLENBQUMsY0FBYyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUM7QUFFbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGtCQUFTLENBQUMsQ0FBQztBQUN0QyxhQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUd6QixlQUFLLENBQUMsS0FBSyxFQUFFLENBQUMifQ==