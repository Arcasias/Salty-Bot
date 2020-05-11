"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromiseManager {
    constructor() {
        this.next = null;
        this.resolving = false;
    }
    async add(fn) {
        if (this.resolving) {
            this.next = fn;
        }
        else {
            this.resolving = fn()
                .then(() => this.addNext())
                .catch(() => this.addNext());
        }
        return this.resolving;
    }
    async addNext() {
        this.resolving = false;
        if (this.next) {
            this.add(this.next);
            this.next = null;
        }
    }
}
exports.default = PromiseManager;
