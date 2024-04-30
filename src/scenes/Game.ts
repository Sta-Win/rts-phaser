import { Vector } from 'matter';
import { createVillagerAnims } from '../anims/VillagerAnims';
import { Unity } from '../objects/Unity';
import '../objects/Villager';
import Villager from '../objects/Villager';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: number[][] = [];
    textureMap : {[texture: number] : number} = {
        0: 0x9cdb43,
        1: 0xa08662
    };
    cellSize = 32;

    unities: Unity[] = []
    

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const nbOfCellPerLine = parseInt(this.game.config.width+'') / this.cellSize;
        const nbOfCellPerColumn = parseInt(this.game.config.height+'') / this.cellSize;
        for (let row = 0; row < nbOfCellPerColumn; row++) {
            this.map.push(new Array(nbOfCellPerLine).fill(0))
        }
        this.map[0][1] = 1;
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000);
        createVillagerAnims(this.anims);
        this.map.forEach((line,y)=>{
            line.forEach((column,x)=>{
                    this.add.rectangle((x*this.cellSize),(y*this.cellSize),this.cellSize,this.cellSize,this.textureMap[column]).setOrigin(0);
            })
        })
        
        this.unities.push(
            this.add.villager(0,0)
        )
        
        this.input.on('pointerdown', (pointerEvent: Phaser.Input.Pointer) => {
            if (pointerEvent.rightButtonDown()) {
                this.unities[0].setDestination({
                    x: pointerEvent.x,
                    y: pointerEvent.y
                })
            }
        });

        this.input.on('wheeldown', () => {
            this.camera.setZoom(this.camera.zoom+1)
        })

        this.input.on('wheelup', () => {
            this.camera.setZoom(this.camera.zoom-1)
        })

        
    }

    update(_time: any, delta: number): void {
        this.unities.forEach(unity => {
            unity.moveToDestination(delta);            
        })
    }
}
