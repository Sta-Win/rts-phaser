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
        this.load.image('tilesGrass', 'assets/TX Tileset Grass.png');
        this.load.image('tilesProps', 'assets/TX Props.png');
    }

    create ()
    {
        this.input.mouse?.disableContextMenu()
        this.scene.start('Preloader');
    }
}
