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
