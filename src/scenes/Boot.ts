import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.atlas('villager', 'assets/villager2.png', 'assets/villager2.json');
    }

    create ()
    {
        this.input.mouse?.disableContextMenu()
        this.scene.start('Preloader');
    }
}
