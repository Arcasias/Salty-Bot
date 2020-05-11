/**
 * Allows to execute promises in the right order
 * Also drops any non-started promises inserted during the execution
 * of the last promise if `executeAll` is set to true.
 * @class
 */
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
export default PromiseManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvbWlzZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9Qcm9taXNlTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUNILE1BQU0sY0FBYztJQUFwQjtRQUNZLFNBQUksR0FBb0IsSUFBSSxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFvQnZDLENBQUM7SUFsQlUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFZO1FBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUNsQjthQUFNO1lBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUU7aUJBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzFCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRU8sS0FBSyxDQUFDLE9BQU87UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDTCxDQUFDO0NBQ0o7QUFFRCxlQUFlLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWxsb3dzIHRvIGV4ZWN1dGUgcHJvbWlzZXMgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gKiBBbHNvIGRyb3BzIGFueSBub24tc3RhcnRlZCBwcm9taXNlcyBpbnNlcnRlZCBkdXJpbmcgdGhlIGV4ZWN1dGlvblxuICogb2YgdGhlIGxhc3QgcHJvbWlzZSBpZiBgZXhlY3V0ZUFsbGAgaXMgc2V0IHRvIHRydWUuXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgUHJvbWlzZU1hbmFnZXIge1xuICAgIHByaXZhdGUgbmV4dDogbnVsbCB8IEZ1bmN0aW9uID0gbnVsbDtcbiAgICBwcml2YXRlIHJlc29sdmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGFzeW5jIGFkZChmbjogRnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5yZXNvbHZpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCA9IGZuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZpbmcgPSBmbigpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5hZGROZXh0KCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMuYWRkTmV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGROZXh0KCkge1xuICAgICAgICB0aGlzLnJlc29sdmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5uZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmFkZCh0aGlzLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvbWlzZU1hbmFnZXI7XG4iXX0=