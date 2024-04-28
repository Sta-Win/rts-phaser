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
        const sprite: string = 'villager.png';
        super(scene, x, y, sprite);
    }

    buildBatiment() {

    }

}

Phaser.GameObjects.GameObjectFactory.register('villager', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    const villager = new Villager(this.scene, x, y);

    this.displayList.add(villager);
    this.updateList.add(villager);

    return villager;
})