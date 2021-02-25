import { env } from "process";
import Salty from "./classes/Salty";

const salty: Salty = new Salty();

if (env.DEBUG !== "true") {
  const EXIT_EVENTS: string[] = [
    // Closing events
    "exit",
    "SIGINT",
    "SIGTERM",
    // Miscellaneous
    "SIGUSR1",
    "SIGUSR2",
    // Uncaught error/rejection
    "uncaughtException",
    "unhandledRejection",
  ];
  for (const event of EXIT_EVENTS) {
    process.on(event as any, () => salty.destroy());
  }
}

export default salty;
