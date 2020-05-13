"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Salty_1 = __importDefault(require("./classes/Salty"));
const utils_1 = require("./utils");
const config_1 = require("./config");
if (process.env.SERVER) {
    process.env.MODE = "server";
}
utils_1.log(`Running on ${process.env.MODE} environment`);
process.env.DEBUG = String(config_1.debugMode);
if (process.env.DEBUG) {
    utils_1.debug(`Debug is active`);
}
fs_1.readdir(config_1.tempImageFolder, (readErr, files) => {
    if (readErr) {
        fs_1.mkdir(config_1.tempImageFolder, (mkdirErr) => {
            if (mkdirErr) {
                utils_1.error(mkdirErr);
            }
        });
        return;
    }
    files.forEach((file) => {
        fs_1.unlink(path_1.join(config_1.tempImageFolder, file), (unlinkErr) => {
            if (unlinkErr) {
                utils_1.error(unlinkErr);
            }
        });
    });
});
Salty_1.default.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQkFBNEM7QUFDNUMsK0JBQTRCO0FBQzVCLDREQUFvQztBQUNwQyxtQ0FBNEM7QUFDNUMscUNBQXNEO0FBR3RELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0NBQy9CO0FBQ0QsV0FBRyxDQUFDLGNBQWMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDO0FBRWxELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxrQkFBUyxDQUFDLENBQUM7QUFDdEMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtJQUNuQixhQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztDQUM1QjtBQUdELFlBQU8sQ0FBQyx3QkFBZSxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ3hDLElBQUksT0FBTyxFQUFFO1FBQ1QsVUFBSyxDQUFDLHdCQUFlLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNoQyxJQUFJLFFBQVEsRUFBRTtnQkFDVixhQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbkI7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU87S0FDVjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQixXQUFNLENBQUMsV0FBSSxDQUFDLHdCQUFlLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM5QyxJQUFJLFNBQVMsRUFBRTtnQkFDWCxhQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDcEI7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFHSCxlQUFLLENBQUMsS0FBSyxFQUFFLENBQUMifQ==