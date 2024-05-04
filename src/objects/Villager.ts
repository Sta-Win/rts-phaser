import { MovableUnit } from "./MovableUnit";

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            villager(x: number, y: number): Villager;
        }
    }
}

export default class Villager extends MovableUnit {

    sprite: string = 'villager';
    speed: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'villager');
        this.taskRegistry.register([
            {
                key: 'build',
                value: this.build
            }
        ]);
        this.anims.play('villager-idle-bottom')
    }

    build(what: string): void {
        throw Error('method is not implemented');
    }

}

Phaser.GameObjects.GameObjectFactory.register('villager', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    const villager = new Villager(this.scene, x, y);

    villager.setInteractive();
    this.scene.physics.add.existing(villager);
    this.displayList.add(villager);
    this.updateList.add(villager);

    return villager;
})