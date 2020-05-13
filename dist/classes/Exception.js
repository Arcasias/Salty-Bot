"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SaltyException extends Error {
    constructor(name, message) {
        super(message);
        this.name = "SaltyException";
        if (name && message) {
            this.message = message;
            this.name = name;
        }
        else {
            this.message = name;
        }
    }
}
exports.SaltyException = SaltyException;
class EmptyObject extends SaltyException {
    constructor(object) {
        super(`${object} is empty`);
        this.name = "EmptyObject";
    }
}
exports.EmptyObject = EmptyObject;
class IncorrectValue extends SaltyException {
    constructor(requiredArgument, requiredType) {
        super(`**${requiredArgument}** must be a ${requiredType}`);
        this.name = "IncorrectValue";
    }
}
exports.IncorrectValue = IncorrectValue;
class MissingArg extends SaltyException {
    constructor(missingArgument) {
        super(`you must provide **${missingArgument}** for it to work`);
        this.name = "MissingArg";
    }
}
exports.MissingArg = MissingArg;
class MissingMention extends SaltyException {
    constructor() {
        super(`you need to mention someone`);
        this.name = "MissingMention";
    }
}
exports.MissingMention = MissingMention;
class OutOfRange extends SaltyException {
    constructor(index) {
        super(`item n°${index} doesn't exist`);
        this.name = "OutOfRange";
    }
}
exports.OutOfRange = OutOfRange;
class PermissionDenied extends SaltyException {
    constructor(requiredPermission, user = "you") {
        super(`${user} need to be **${requiredPermission}** to do this`);
        this.name = "PermissionDenied";
    }
}
exports.PermissionDenied = PermissionDenied;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvRXhjZXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBYSxjQUFlLFNBQVEsS0FBSztJQUdyQyxZQUFZLElBQVksRUFBRSxPQUFnQjtRQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFIWixTQUFJLEdBQVcsZ0JBQWdCLENBQUM7UUFJbkMsSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUN2QjtJQUNMLENBQUM7Q0FDSjtBQVpELHdDQVlDO0FBRUQsTUFBYSxXQUFZLFNBQVEsY0FBYztJQUczQyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLEdBQUcsTUFBTSxXQUFXLENBQUMsQ0FBQztRQUh6QixTQUFJLEdBQVcsYUFBYSxDQUFDO0lBSXBDLENBQUM7Q0FDSjtBQU5ELGtDQU1DO0FBRUQsTUFBYSxjQUFlLFNBQVEsY0FBYztJQUc5QyxZQUFZLGdCQUF3QixFQUFFLFlBQW9CO1FBQ3RELEtBQUssQ0FBQyxLQUFLLGdCQUFnQixnQkFBZ0IsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUh4RCxTQUFJLEdBQVcsZ0JBQWdCLENBQUM7SUFJdkMsQ0FBQztDQUNKO0FBTkQsd0NBTUM7QUFFRCxNQUFhLFVBQVcsU0FBUSxjQUFjO0lBRzFDLFlBQVksZUFBZTtRQUN2QixLQUFLLENBQUMsc0JBQXNCLGVBQWUsbUJBQW1CLENBQUMsQ0FBQztRQUg3RCxTQUFJLEdBQVcsWUFBWSxDQUFDO0lBSW5DLENBQUM7Q0FDSjtBQU5ELGdDQU1DO0FBRUQsTUFBYSxjQUFlLFNBQVEsY0FBYztJQUc5QztRQUNJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBSGxDLFNBQUksR0FBVyxnQkFBZ0IsQ0FBQztJQUl2QyxDQUFDO0NBQ0o7QUFORCx3Q0FNQztBQUVELE1BQWEsVUFBVyxTQUFRLGNBQWM7SUFHMUMsWUFBWSxLQUFhO1FBQ3JCLEtBQUssQ0FBQyxVQUFVLEtBQUssZ0JBQWdCLENBQUMsQ0FBQztRQUhwQyxTQUFJLEdBQVcsWUFBWSxDQUFDO0lBSW5DLENBQUM7Q0FDSjtBQU5ELGdDQU1DO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSxjQUFjO0lBR2hELFlBQVksa0JBQTBCLEVBQUUsT0FBZSxLQUFLO1FBQ3hELEtBQUssQ0FBQyxHQUFHLElBQUksaUJBQWlCLGtCQUFrQixlQUFlLENBQUMsQ0FBQztRQUg5RCxTQUFJLEdBQVcsa0JBQWtCLENBQUM7SUFJekMsQ0FBQztDQUNKO0FBTkQsNENBTUMifQ==