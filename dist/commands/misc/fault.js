import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
export default new Command({
    name: "fault",
    keys: ["overwatch", "reason"],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],
    visibility: "public",
    async action(msg) {
        const fault = Salty.getList("fault");
        const text = (choice(fault.start) + choice(fault.sentence))
            .replace(/<subject>/g, choice(fault.subject))
            .replace(/<reason>/g, choice(fault.reason))
            .replace(/<punishment>/g, choice(fault.punishment));
        await Salty.message(msg, text);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9mYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXJDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO0lBQzdCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUseUJBQXlCO1NBQ3BDO0tBQ0o7SUFDRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDWixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3RELE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QyxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFeEQsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uLy4uL2NsYXNzZXMvQ29tbWFuZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5pbXBvcnQgeyBjaG9pY2UgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbW1hbmQoe1xuICAgIG5hbWU6IFwiZmF1bHRcIixcbiAgICBrZXlzOiBbXCJvdmVyd2F0Y2hcIiwgXCJyZWFzb25cIl0sXG4gICAgaGVscDogW1xuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogbnVsbCxcbiAgICAgICAgICAgIGVmZmVjdDogXCJDaGVjayB3aG9zZSBmYXVsdCBpdCBpc1wiLFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgdmlzaWJpbGl0eTogXCJwdWJsaWNcIixcbiAgICBhc3luYyBhY3Rpb24obXNnKSB7XG4gICAgICAgIGNvbnN0IGZhdWx0ID0gU2FsdHkuZ2V0TGlzdChcImZhdWx0XCIpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gKGNob2ljZShmYXVsdC5zdGFydCkgKyBjaG9pY2UoZmF1bHQuc2VudGVuY2UpKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxzdWJqZWN0Pi9nLCBjaG9pY2UoZmF1bHQuc3ViamVjdCkpXG4gICAgICAgICAgICAucmVwbGFjZSgvPHJlYXNvbj4vZywgY2hvaWNlKGZhdWx0LnJlYXNvbikpXG4gICAgICAgICAgICAucmVwbGFjZSgvPHB1bmlzaG1lbnQ+L2csIGNob2ljZShmYXVsdC5wdW5pc2htZW50KSk7XG5cbiAgICAgICAgYXdhaXQgU2FsdHkubWVzc2FnZShtc2csIHRleHQpO1xuICAgIH0sXG59KTtcbiJdfQ==