/**
 * Allows to execute promises in the right order
 * Also drops any non-started promises inserted during the execution
 * of the last promise if `executeAll` is set to true.
 *
 * @class
 * @param {boolean} [executeAll] sequentially executes every added function
 */
class PromiseManager {
    constructor(executeAll=false) {
        this.executeAll = executeAll;
        this.resolving = false;
        this.next = executeAll ? [] : false;
    }
    /**
     * @public
     * @param {Function} fn
     * @returns {Promise}
     */
    async add(fn) {
        if (this.resolving) {
            if (this.executeAll) {
                this.next.push(fn);
            } else {
                this.next = fn;
            }
        } else {
            this.resolving = fn()
                .then(() => this._addNext())
                .catch(() => this._addNext());
        }
        return this.resolving;
    }
    /**
     * @private
     */
    async _addNext() {
        this.resolving = false;
        if (this.executeAll) {
            if (this.next.length) {
                this.add(this.next.pop());
            }
        } else {
            if (this.next) {
                this.add(this.next);
                this.next = false;
            }
        }
    }
}

export default PromiseManager;