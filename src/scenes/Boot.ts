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
        this.load.image('tiles', 'assets/rts-phaset-tileset_0001.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
    }

    create ()
    {
        this.input.mouse?.disableContextMenu()
        this.scene.start('Preloader');
    }
}
