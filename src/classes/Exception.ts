export class SaltyException extends Error {
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

export class EmptyObject extends SaltyException {
    public name: string = "EmptyObject";

    constructor(object: string) {
        super(`${object} is empty`);
    }
}

export class IncorrectValue extends SaltyException {
    public name: string = "IncorrectValue";

    constructor(requiredArgument: string, requiredType: string) {
        super(`**${requiredArgument}** must be a ${requiredType}`);
    }
}

export class MissingArg extends SaltyException {
    public name: string = "MissingArg";

    constructor(missingArgument: string) {
        super(`you must provide **${missingArgument}** for it to work`);
    }
}

export class MissingMention extends SaltyException {
    public name: string = "MissingMention";

    constructor() {
        super(`you need to mention someone`);
    }
}

export class OutOfRange extends SaltyException {
    public name: string = "OutOfRange";

    constructor(index: number) {
        super(`item n°${index} doesn't exist`);
    }
}

export class PermissionDenied extends SaltyException {
    public name: string = "PermissionDenied";

    constructor(requiredPermission: string, user: string = "you") {
        super(`${user} need to be **${requiredPermission}** to do this`);
    }
}
