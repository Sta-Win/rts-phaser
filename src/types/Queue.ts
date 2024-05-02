export class Queue<T> {

    queue: T[] = [];

    next(): T | undefined {
        return this.queue.shift();
    }

    add(value: T): void {
        this.queue.push(value);
    }

    empty(): void {
        this.queue = [];
    }

    first(): T {
        return this.queue[0];
    }
}