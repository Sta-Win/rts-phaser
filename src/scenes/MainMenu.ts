import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.title = this.add.text(
            parseInt(this.game.config.width+'')/2,
            parseInt(this.game.config.height+'')/2,
            'RTS Phaser',
            {
                fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }
        ).setOrigin()
        this.scene.start('Game');

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
