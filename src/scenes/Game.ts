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
    player : Phaser.GameObjects.Arc; 
    

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
        this.player = this.add.circle(0,0,this.cellSize/2,0xff0000,).setOrigin(0);
        this.input.on('pointerdown',(e: any)=>{
            if(e.leftButtonDown()){
                this.player.setPosition(e.x-this.cellSize/2,e.y-this.cellSize/2) 
            }
           
        })

        
    }
    update(): void {
        
    }
}
