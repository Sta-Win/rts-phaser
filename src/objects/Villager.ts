import { Unity } from "./Unity";


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

export default class Villager extends Unity {

    sprite: string;
    speed: number = 10;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'villager');
        this.anims.play('villager-idle-bottom')
    }

    buildBatiment() {

    }

}

Phaser.GameObjects.GameObjectFactory.register('villager', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    const villager = new Villager(this.scene, x, y);

    villager.setPosition(500,500)

    this.displayList.add(villager);
    this.updateList.add(villager);

    return villager;
})