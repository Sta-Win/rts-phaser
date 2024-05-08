import { Registry } from "../types/Registry";
import { Location } from "../types/Location";
import { Task, TaskResolver } from "../types/Task";
import { Queue } from "../types/Queue";

export type SpriteConstructorParams = {
    scene: Phaser.Scene,
    x: number,
    y: number,
    sprite?: string
}

export abstract class Unit extends Phaser.Physics.Arcade.Sprite {

    sprite: string;
    
    taskRegistry: Registry<TaskResolver> = new Registry<TaskResolver>();

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite);
    }

    public readonly taskQueue: Queue<Task> = new Queue<Task>();

    getLocation(): Location {
        return {
            x: this.x,
            y: this.y
        }
    }

    work(task: Task): void {
        const resolve = this.taskRegistry.get(task.type) as Function;
        const args: any[] = task.args ? Object.values(task.args) : [];
        resolve.bind(this, ...args)();
    }

    doThings(delta: number): void {
        const currentOrder: Task = this.taskQueue.first();
       
        if (!currentOrder) {
            this.state = 'idle';
        } else {
            currentOrder.args = {...currentOrder.args, delta};
            this.state = 'active';
            switch (currentOrder.status) {
                case 'done': {
                    const nextOrder: Task | undefined = this.taskQueue.next();
                    if (nextOrder) {
                        this.state = 'in progress'
                    } else {
                        this.state = 'idle'
                    }
                    this.work(currentOrder);
                    break;
                }
                case "in progress":
                case "waiting":
                {
                    this.work(currentOrder);
                    break;
                }
            }
        }
    }

    taskDone(): void {
        this.taskQueue.next();
    }

}

export function isUnit(gameObject: Phaser.GameObjects.GameObject): gameObject is Unit {
    return 'sprite' in gameObject;
}