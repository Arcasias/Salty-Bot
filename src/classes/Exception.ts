class SaltyException extends Error {
    public name: string = "SaltyException";

    constructor(name: string, message?: string) {
        super(message);
        if (name && message) {
            this.message = message;
            this.name = name;
        } else {
            this.message = name;
        }
    }
}

class DeprecatedCommand extends SaltyException {
    public name: string = "DeprecatedCommand";

    constructor(commandName: string) {
        super(
            `Command "${commandName}" is deprecated and can no longer be used`
        );
    }
}

class EmptyObject extends SaltyException {
    public name: string = "EmptyObject";

    constructor(object: string) {
        super(`${object} is empty`);
    }
}

class IncorrectValue extends SaltyException {
    public name: string = "IncorrectValue";

    constructor(requiredArgument: string, requiredType: string) {
        super(`**${requiredArgument}** must be a ${requiredType}`);
    }
}

class MissingArg extends SaltyException {
    public name: string = "MissingArg";

    constructor(missingArgument) {
        super(`you must provide **${missingArgument}** for it to work`);
    }
}

class MissingMention extends SaltyException {
    public name: string = "MissingMention";

    constructor() {
        super(`you need to mention someone`);
    }
}

class OutOfRange extends SaltyException {
    public name: string = "OutOfRange";

    constructor(index: number) {
        super(`item n°${index} doesn't exist`);
    }
}

class PermissionDenied extends SaltyException {
    public name: string = "PermissionDenied";

    constructor(requiredPermission: string, user: string = "you") {
        super(`${user} need to be **${requiredPermission}** to do this`);
    }
}

export {
    SaltyException,
    DeprecatedCommand,
    EmptyObject,
    IncorrectValue,
    MissingArg,
    MissingMention,
    OutOfRange,
    PermissionDenied,
};
