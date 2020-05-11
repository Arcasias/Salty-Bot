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
class DeprecatedCommand extends SaltyException {
    constructor(commandName) {
        super(`Command "${commandName}" is deprecated and can no longer be used`);
        this.name = "DeprecatedCommand";
    }
}
class EmptyObject extends SaltyException {
    constructor(object) {
        super(`${object} is empty`);
        this.name = "EmptyObject";
    }
}
class IncorrectValue extends SaltyException {
    constructor(requiredArgument, requiredType) {
        super(`**${requiredArgument}** must be a ${requiredType}`);
        this.name = "IncorrectValue";
    }
}
class MissingArg extends SaltyException {
    constructor(missingArgument) {
        super(`you must provide **${missingArgument}** for it to work`);
        this.name = "MissingArg";
    }
}
class MissingMention extends SaltyException {
    constructor() {
        super(`you need to mention someone`);
        this.name = "MissingMention";
    }
}
class OutOfRange extends SaltyException {
    constructor(index) {
        super(`item n°${index} doesn't exist`);
        this.name = "OutOfRange";
    }
}
class PermissionDenied extends SaltyException {
    constructor(requiredPermission, user = "you") {
        super(`${user} need to be **${requiredPermission}** to do this`);
        this.name = "PermissionDenied";
    }
}
export { SaltyException, DeprecatedCommand, EmptyObject, IncorrectValue, MissingArg, MissingMention, OutOfRange, PermissionDenied, };
