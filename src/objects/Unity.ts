import { Location } from "../types/Location";
import { MathUtils } from "../utils/math";

export abstract class Unity extends Phaser.Physics.Arcade.Sprite {

    abstract sprite: string;
    abstract speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite);
    }

    /**
     * Location where the unity aims to move
     */
    private _destination?: Location;

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
                this.setPosition(moveX, moveY);
            } else {
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