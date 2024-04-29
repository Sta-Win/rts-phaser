import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.atlas('villager', 'assets/villager.png', 'assets/villager.json');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
