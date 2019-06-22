'use strict';

class SaltyException extends Error {

    constructor(name='SaltyException', message='an error occurred', ...args) {
        super(message, ...args);

        this.name = name;
    }
}

class EmptyObject extends SaltyException {

    constructor(object, ...args) {
        super('EmptyObject', `${ object } is empty`, ...args);
    }
}

class IncorrectValue extends SaltyException {

    constructor(requiredArgument, requiredType, ...args) {
        super('IncorrectValue', `**${ requiredArgument }** must be a ${ requiredType }`, ...args);
    }
}

class MissingArg extends SaltyException {

    constructor(missingArgument, ...args) {
        super('MissingArg', `you must provide **${ missingArgument }** for it to work`, ...args);
    }
}

class MissingMention extends SaltyException {

    constructor(arg, ...args) {
        super('MissingMention', `you need to mention someone`, ...args);
    }   
}

class OutOfRange extends SaltyException {

    constructor(index, ...args) {
        super('OutOfRange',  `item n°${ index } doesn't exist`, ...args);
    }
}

class PermissionDenied extends SaltyException {

    constructor(requiredPermission, user="you", ...args) {
        super('PermissionDenied', `${ user } need to be **${ requiredPermission }** to do this`, ...args);
    }   
}


module.exports = {
    SaltyException,
    EmptyObject,
    IncorrectValue,
    MissingArg,
    MissingMention,
    OutOfRange,
    PermissionDenied,
};