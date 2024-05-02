import { Location } from "../types/Location";
import { Order } from "../types/Order";
import { Queue } from "../types/Queue";
import { MathUtils } from "../utils/math";

export abstract class Unit extends Phaser.Physics.Arcade.Sprite {

    abstract sprite: string;
    abstract speed: number;

    orderFunctionMap: {[fnName: string]: (params?: any) => any} = {
        'moveTo': this.moveToDestination
    }

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite);
    }

    /**
     * Location where the unity aims to move
     */
    private _destination?: Location;

    public readonly ordersQueue = new Queue<Order>();

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

    abstract work(order: Order): void;

    doThings(): void {
        const currentOrder = this.ordersQueue.first();
        if (!currentOrder) {
            this.state = 'idle';
        } else {
            this.state = 'active';
            switch (currentOrder.status) {
                case 'done': {
                    const nextOrder = this.ordersQueue.next();
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

    moveToDestination(delta: number) {
        const destination = this.getDestination();
        if (destination) {
            if (this.x !== destination.x || this.y !== destination.y) {
                const unityLocation = this.getLocation();
                const distance = MathUtils.pythagore(destination.x, destination.y, unityLocation.x, unityLocation.y);
                const moveFactor = Math.min((this.speed * (delta/1000)), distance) / distance;
                const moveX = this.x + (destination.x - this.x) * moveFactor;
                const moveY = this.y + (destination.y - this.y) * moveFactor;
                this.playAnimation(destination, unityLocation);
                this.scene.physics.moveTo(this, destination.x, destination.y)
                if (moveFactor > distance) {
                    this.setVelocity(0)
                }
            } else {
                this.setVelocity(0)
                this.anims.play(`${this.sprite}-idle-bottom`);                
            }
        }
    }

    private playAnimation(destination: Location, unityLocation: Location) {
        const lateralMovement = destination.x - unityLocation.x;
        const verticalMovement = destination.y - unityLocation.y;
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
        this.anims.play(`${this.sprite}-run-${direction}`);
    }
}

export function isUnit(gameObject: Phaser.GameObjects.GameObject): gameObject is Unit {
    return 'sprite' in gameObject;
}