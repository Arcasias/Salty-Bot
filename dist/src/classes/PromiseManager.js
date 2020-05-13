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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvbWlzZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xhc3Nlcy9Qcm9taXNlTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLE1BQU0sY0FBYztJQUFwQjtRQUNZLFNBQUksR0FBb0IsSUFBSSxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFvQnZDLENBQUM7SUFsQlUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFZO1FBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUNsQjthQUFNO1lBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUU7aUJBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzFCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRU8sS0FBSyxDQUFDLE9BQU87UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==