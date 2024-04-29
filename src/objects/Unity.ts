import { Location } from "../types/Location";

export abstract class Unity extends Phaser.Physics.Arcade.Sprite {

    abstract sprite: string;
    abstract speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x, y, sprite);
    }

    /**
     * Location where the unity aims to move
     */
    private _desiredLocation?: Location;

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

    setDesiredLocation(location: Location | undefined = undefined) {
        this._desiredLocation = location;
    }

    public getDesiredLocation()
    {
        return this._desiredLocation;
    }

    moveToDesiredLocation(delta: number) {
        const desiredLocation = this.getDesiredLocation();
        if (desiredLocation) {
            const unityLocation = this.getLocation();
            console.log(desiredLocation, unityLocation)
            const newLocation: Location = {
                x: (desiredLocation.x - unityLocation.x),
                y: (desiredLocation.y - unityLocation.y)
            }
            console.log('=>', newLocation)
            this.setPosition(newLocation.x, newLocation.y);
            if (unityLocation.x === desiredLocation.x && unityLocation.y === desiredLocation.y) {
                this.setDesiredLocation();
            }
        }
    }
}