import { Location } from "../types/Location";
import { Task } from "../types/Order";
import { Queue } from "../types/Queue";
import { MathUtils } from "../utils/math";

export abstract class Unit extends Phaser.Physics.Arcade.Sprite {

    abstract sprite: string;
    abstract speed: number;

    taskFunctionMap: {[fnName: string]: (...params: any) => any} = {
        'moveTo': this.moveToDestination
    }

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite);
    }

    /**
     * Location where the unity aims to move
     */
    private _destination?: Location;

    public readonly taskQueue = new Queue<Task>();

    getLocation(): Location {
        return {
            x: this.x,
            y: this.y
        }
    }

    getSpeed(): number {
        return this.speed;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setDestination(location: Location | undefined = undefined) {
        this._destination = location;
    }

    public getDestination()
    {
        return this._destination;
    }

    abstract work(order: Task): void;

    doThings(delta: number): void {
        const currentOrder = this.taskQueue.first();
        if (!currentOrder) {
            this.state = 'idle';
        } else {
            currentOrder.args = {...currentOrder.args, delta};
            this.state = 'active';
            switch (currentOrder.status) {
                case 'done': {
                    const nextOrder = this.taskQueue.next();
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

    moveToDestination(x: number, y: number, delta: number) {
        const destination: Location = {x, y};
        if (destination) {
            const isNotArrived = this.x !== destination.x || this.y !== destination.y;
            if (isNotArrived) {
                const unitLocation = this.getLocation();
                const distance = MathUtils.pythagore(destination.x, destination.y, unitLocation.x, unitLocation.y);
                const direction = this.getDirection(
                    destination.x - unitLocation.x,
                    destination.y - unitLocation.y
                );
                const animationNotDone = !(this.anims.getProgress() < 1);
                if (animationNotDone) {
                    this.playAnimation(direction, 'run');
                }
                if ((this.speed * (delta/1000)) > distance) {
                    this.setVelocity(0)
                    this.playAnimation(direction, 'idle')
                    this.taskDone();
                    return;
                }
                this.scene.physics.moveTo(this, destination.x, destination.y)
            }
        }
    }

    taskDone() {
        this.taskQueue.next();
    }

    private playAnimation(direction: string, state: string) {
        this.anims.play(`${this.sprite}-${state}-${direction}`);
    }

    private getDirection(lateralMovement: number, verticalMovement: number): string {
        let direction = '';
        if (Math.abs(lateralMovement) > Math.abs(verticalMovement)) {
            if (lateralMovement > 0) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        } else {
            if (verticalMovement > 0) {
                direction = 'bottom';
            } else {
                direction = 'top';
            }
        }
        return direction;
    }
}

export function isUnit(gameObject: Phaser.GameObjects.GameObject): gameObject is Unit {
    return 'sprite' in gameObject;
}