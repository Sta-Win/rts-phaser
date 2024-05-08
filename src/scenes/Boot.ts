import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload(): void
    {
        this.load.atlas('villager', 'assets/villager2.png', 'assets/villager2.json');
        this.load.spritesheet('tiles', 'assets/rts-phaset-tileset_0001.png', {frameWidth: 32});
        this.load.tilemapTiledJSON('map', 'assets/map.json');
    }

    create(): void
    {
        this.input.mouse?.disableContextMenu()
        this.scene.start('Preloader');
    }
}
