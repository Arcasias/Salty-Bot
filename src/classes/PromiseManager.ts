/**
 * Allows to execute promises in the right order
 * Also drops any non-started promises inserted during the execution
 * of the last promise if `executeAll` is set to true.
 * @class
 */
class PromiseManager {
    private next: null | Function = null;
    private resolving: boolean = false;

    public async add(fn: Function): Promise<any> {
        if (this.resolving) {
            this.next = fn;
        } else {
            this.resolving = fn()
                .then(() => this.addNext())
                .catch(() => this.addNext());
        }
        return this.resolving;
    }

    private async addNext() {
        this.resolving = false;
        if (this.next) {
            this.add(this.next);
            this.next = null;
        }
    }
}

export default PromiseManager;
