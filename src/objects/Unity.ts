export abstract class Unity extends Phaser.GameObjects.Shape {

    constructor(scene: Phaser.Scene) {
        super(scene);
        const gof = new Phaser.GameObjects.GameObjectFactory(scene);
        gof.arc(0,0,32,0,360,false,0xff0000);
    }

    private desiredLocation?: {x: number, y: number};

    public setDesiredLocation(x: number, y: number): void {
        this.desiredLocation = {x, y};
    }
}