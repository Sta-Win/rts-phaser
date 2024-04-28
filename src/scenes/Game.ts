import { Scene } from 'phaser';
import { Unity } from '../objects/Unity';
import { Villager } from '../objects/Villager';

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
    //player : Villager;
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
        this.player.setData('speed', 10);
        
        this.input.on('pointerdown',(e: any)=>{
            if(e.leftButtonDown()){
                this.player.setData('desiredLocation', {x: e.x-this.cellSize/2,y: e.y-this.cellSize/2}); 
            }
           
        })
    }

    update(): void {
        const desiredLocation = this.player.getData('desiredLocation');
        if (desiredLocation) {
            console.log({x: this.player.x, y: this.player.y})
            console.log(desiredLocation)
            const moveX = Math.round((desiredLocation.x - this.player.x) / this.player.getData('speed'));
            const moveY = Math.round((desiredLocation.y - this.player.y) / this.player.getData('speed'));
            console.log(moveX, moveY)
            this.player.setPosition(this.player.x + moveX, this.player.y + moveY);
            if (this.player.x === desiredLocation.x && this.player.y === desiredLocation.y) {
                this.player.setData('desiredPosition', null);
            }
        }

        
    }
}
