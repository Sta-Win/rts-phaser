import { Vector } from 'matter';
import { createVillagerAnims } from '../anims/VillagerAnims';
import { Unity } from '../objects/Unity';
import '../objects/Villager';
import Villager from '../objects/Villager';
import { GameObjects, Scene } from 'phaser';
import { Location } from '../types/Location';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: number[][] = [];
    textureMap : {[texture: number] : number} = {
        0: 0x9cdb43,
        1: 0xa08662
    };
    cellSize = 32;

    private readonly unities: Unity[] = []

    private _selectedUnities: Unity[] = [];

    setSelectedUnities(selectedUnities: Unity[]): void {
        this._selectedUnities = selectedUnities;
    }

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
        
        this.input.on('pointerdown', (pointerEvent: Phaser.Input.Pointer, objects: Phaser.GameObjects.GameObject[]) => {
            if (pointerEvent.rightButtonDown()) {
                if (this._selectedUnities.length > 0) {
                    const destination = {x: pointerEvent.worldX, y: pointerEvent.worldY};
                    this.moveUnities(destination);
                }                
            }
            if (pointerEvent.leftButtonDown()) {
                if (objects.length < 0) {
                    this.setSelectedUnities([]);
                } else {
                    this.setSelectedUnities([objects[0] as Unity]);
                }
                
            }
        });

        this.input.on('wheel', (pointerEvent: Phaser.Input.Pointer) => {
            const zoomLevel = pointerEvent.deltaY / 500;
            const nextZoomLevel = this.camera.zoom + zoomLevel;
            if (nextZoomLevel > 0.5 && nextZoomLevel < 2.5) {
                this.camera.setZoom(this.camera.zoom+zoomLevel)
            }
        })

        this.input.on('wheelup', () => {
            this.camera.setZoom(this.camera.zoom-1)
        })
        
    }

    private moveUnities(destination: Location) {
        this.selectedUnities.forEach(selectedUnity => {
            selectedUnity.setDestination(destination);
        });
    }

    update(_time: any, delta: number): void {
        this.unities.forEach(unity => {
            unity.moveToDestination(delta);            
        })
    }
}
