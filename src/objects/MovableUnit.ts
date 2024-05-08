import { MathUtils } from "../utils/math";
import { Unit } from "./Unit";
import { Location } from "../types/Location";
import PhaserNavMeshPlugin, { PhaserNavMesh } from "phaser-navmesh/src";

export abstract class MovableUnit extends Unit {

    abstract speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
        super(scene, x , y, sprite);
        this.taskRegistry.register([
            {
                key: 'moveTo',
                value: this.moveToDestination
            }
        ]);
    }

    getSpeed(): number {
        return this.speed;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    moveToDestination(x: number, y: number, delta: number): void {
        const destination: Location = {x, y};
        if (destination) {
            const isNotArrived: boolean = this.x !== destination.x || this.y !== destination.y;
            if (isNotArrived) {
                const unitLocation: Location = this.getLocation();
                const distance: number = MathUtils.pythagore(destination.x, destination.y, unitLocation.x, unitLocation.y);
                const direction: string = this.getDirection(
                    destination.x - unitLocation.x,
                    destination.y - unitLocation.y
                );
                const animationNotDone: boolean = !(this.anims.getProgress() < 1);
                if (animationNotDone) {
                    this.playAnimation(direction, 'run');
                }
                if ((this.speed * (delta/1000)) > distance) {
                    this.setVelocity(0)
                    this.playAnimation(direction, 'idle')
                    this.taskDone();
                    return;
                }
                this.scene.physics.moveTo(this, destination.x, destination.y);
            }
        }
    }

    private playAnimation(direction: string, state: string): void {
        this.anims.play(`${this.sprite}-${state}-${direction}`);
    }

    private getDirection(lateralMovement: number, verticalMovement: number): string {
        let direction: string = '';
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