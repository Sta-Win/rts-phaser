import '../objects/Villager';
import Villager from '../objects/Villager';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map = [
        [0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,1,1,0],
        [1,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];
    textureMap : {[texture: number] : number} = {
        0: 0x9cdb43,
        1: 0xa08662
    };
    cellSize = 64;
    villager : Villager;
    

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000);
        this.map.forEach((line,y)=>{
            line.forEach((column,x)=>{
                    this.add.rectangle((x*this.cellSize),(y*this.cellSize),this.cellSize,this.cellSize,this.textureMap[column]).setOrigin(0);
            })
        })
        this.villager = this.add.villager(0,0);
        this.villager.setData('speed', 10);
        
        this.input.on('pointerdown', (pointerEvent: Phaser.Input.Pointer) => {
            if (pointerEvent.leftButtonDown()) {
                this.villager.setDesiredLocation({
                    x: pointerEvent.x - (this.cellSize/2),
                    y: pointerEvent.y - (this.cellSize/2) 
                })
                console.log(this.villager.getDesiredLocation())
            }
        });
    }

    update(): void {
        this.villager.moveToDesiredLocation()     
    }
}
