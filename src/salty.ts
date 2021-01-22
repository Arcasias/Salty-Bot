import Salty from "./classes/Salty";

const salty: Salty = new Salty();
const EXIT_EVENTS: string[] = [
  // On app closing
  "exit",
  // On Ctrl+C event
  "SIGINT",
  // On pid killed
  "SIGUSR1",
  "SIGUSR2",
  // On uncaught error
  "uncaughtException",
  "unhandledRejection",
];

for (const event of EXIT_EVENTS) {
  process.on(event as any, () => salty.destroy());
}

export default salty;
