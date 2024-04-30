import { Unit } from "./Unit";


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

export default class Villager extends Unit {

    sprite: string = 'villager';
    speed: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'villager');
        this.anims.play('villager-idle-bottom')
    }

    buildBatiment() {

    }

}

Phaser.GameObjects.GameObjectFactory.register('villager', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    const villager = new Villager(this.scene, x, y);

    villager.setInteractive();

    this.displayList.add(villager);
    this.updateList.add(villager);

    return villager;
})