'use strict';

const Multiton = require('./Multiton');
const S = require('./Salty');
const error = require('./Exception');

const permissions = {
    public: null,
    admin: S.isAdmin,
    dev: S.isDev,
    owner: S.isOwner,
};
const PERM_GET = 0;
const PERM_SET = 1;
const PERM_DEL = 2;
const PERM_CLS = 3;

class Command extends Multiton {
    /**
     * Command constructor. Takes a data object containing all accepted parameters.
     * @param {Object}   data - The data object containing the parameters of the command.
     * @param {Object}   data.action
     * @param {Object[]} data.help
     * @param {String[]} data.keys
     * @param {String}   data.[mode]
     * @param {String}   data.name
     * @param {String}   data.visibility
     */
    constructor(values) {
        super(...arguments);

        this.action = values.action;
        this.help = values.help;
        this.keys = values.keys;
        this.name = values.name;
        this.visibility = values.visibility;
        this.mode = values.mode;
    }

    /**
     * Runs the command action
     * @param  {Object}  msg 
     * @param  {Array}   args
     * @param  {Boolean} [crud] WIP 
     */
    async run(msg, args, crud=false) {
        try {
            if (this.visibility !== 'public' && ! permissions[this.visibility].call(S, msg.author, msg.guild)) {
                throw new error.PermissionDenied(this.visibility);
            }
            if (this.mode && this.mode !== process.env.MODE) {
                throw new error.SaltyException('WrongEnvironment', "it looks like I'm not in the right environment to do that");
            }
            await this.action(msg, args);
        } catch (err) {
            LOG.error(err.stack);
            await S.embed(msg, { title: err.message, type: 'error' });
        }
    }
}

/** Class representing an object-related command. */
class ObjectCommand extends Command {
    // POTENTIALLY BENEFITTING COMMANDS :
    //      - blacklist (id)
    //      - command ({name, keys, effect(which is not displayable)}) => include help ?
    //      - todo (string)
    //      - favorites ({fucked up display, few key=>values})
    //      - queue (same as favorite)


    /**
     * Create a command.
     *      The "list" parameter should be an list of objects containing the following attributes :
     *      - 'name': Name or reference of the object, used for searching and displaying the object
     *      - values: the rest of the values should be explicited as key => value pairs, with
     *          the key being explicit enough about what the value is about
     *          
     * @param {Object} data - The data object containing the parameters of the command.
     */
    constructor(data) {
        super(data);
        this.perm = [
            data.get || true, // 0
            data.set || true, // 1
            data.del || true, // 2
            data.cls || true, // 3
        ];
        this.list = data.list;
        this.constraint = data.constraint || ((msg, args) => args.slice(1).join(" "));
    }

    _run(msg, args) {

        let joined = args.join(" ");

        if (args[0]) {

            // add
            if (S.getList('add').includes(args[0])) {

                if (! this.perm[PERM_SET]) throw new error.PermissionDenied("create");
                if (! args[1]) throw new error.MissingArg("element");

                let newElement = contraint(msg, args);

                if (! newElement) throw new error.SaltyException("wrong usage");

                this.list.push(newElement);

                S.embed(msg, { title: `${args.join(" ")} added to ${this.name}`, type: 'success' });

            // delete
            } else if (S.getList('delete').includes(args[0])) {

                if (! this.perm[PERM_SET]) throw new error.PermissionDenied("delete");
                if (! args[1]) throw new error.MissingArg("element");

                let elementIndex;
                let argIsIndex = (! isNaN(args[1]));

                if (argIsIndex) {

                    elementIndex = parseInt(args[1]);
                    
                } else {

                    elementIndex = this.list.indexOf(this.list.find(el => Object.values(el).includes(joined)));
                }

                if (! this.list[elementIndex]) throw new error.OutOfRange(elementIndex);

                this.list.splice(elementIndex, 1);

                S.embed(msg, { title: `${ argIsIndex ? 'item number ' + args[1]
                    : joined } removed from ${this.name}`, type: 'success' });

            // clear
            } else if (S.getList('clear').includes(args[0])) {

                if (! this.perm[PERM_SET]) throw new error.PermissionDenied("clear");
                
                this.list = [];

                S.embed(msg, { title: `${this.name} cleared`, type: 'success' });
            }

        } else {

            // read
            if (! this.perm[PERM_GET]) throw new error.PermissionDenied("read");

            if (args[0]) {

                let element;

                if (! isNaN(args[0])) {

                    element = this.list[parseInt(args[0])];                

                } else {

                    element = this.list.find(el => Object.values(el).includes(joined));
                }

                if (! element) throw new error.OutOfRange(joined);

                S.embed(msg, {
                    title: `${this.name} - ${joined}`,
                    description: Object.values(element).join('\n'),
                });

            } else {

                S.embed(msg, {
                    title: `${this.name}`,
                    description: this.list.map(el => el.name).join('\n'),
                });
            }
        }

        super._run(msg, args);
    }
}

module.exports = Command;