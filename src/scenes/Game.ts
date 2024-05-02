import { createVillagerAnims } from '../anims/VillagerAnims';
import { isUnity, Unit } from '../objects/Unit';
import '../objects/Villager';
import { Scene } from 'phaser';
import { Location } from '../types/Location';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: number[][] = [];
    Map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset | null;
    textureMap : {[texture: number] : number} = {
        0: 0x9cdb43,
        1: 0xa08662
    };
    cellSize = 32;

    private readonly units: Unit[] = []

    private _selectedUnits: Unit[] = [];

    setSelectedUnits(selectedUnits: Unit[]): void {
        this._selectedUnits = selectedUnits;
    }

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.generateMap();
        this.setCamera();
        createVillagerAnims(this.anims);
        
        this.units.push(
            this.add.villager(100,100),
            this.add.villager(200,200)
        );
        
        this.handleEvents();
        
    }

    private handleEvents() {
        this.onClick();
        this.onScroll();
    }

    private onScroll() {
        this.input.on('wheel', (pointerEvent: Phaser.Input.Pointer) => {
            const zoomLevel = pointerEvent.deltaY / 500;
            const nextZoomLevel = this.camera.zoom + zoomLevel;
            if (nextZoomLevel > 0.5 && nextZoomLevel < 2.5) {
                this.camera.setZoom(this.camera.zoom + zoomLevel);
            }
        });
    }

    private onClick() {
        let selectionZone: Phaser.GameObjects.Rectangle;
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objects: Phaser.GameObjects.GameObject[]) => {
            if (pointer.rightButtonDown()) {
                if (this._selectedUnits.length > 0) {
                    const destination = { x: pointer.worldX, y: pointer.worldY };
                    this.moveUnits(destination);
                }
            }
            if (pointer.leftButtonDown()) {
                // Single Unit Target
                if (objects.length > 0) {
                    this.setSelectedUnits([objects[0] as Unit]);
                    
                } else {
                    this.setSelectedUnits([]);
                    // Multiple Unit target
                    selectionZone = this.add.rectangle(pointer.x, pointer.y, 0,0, 0xffffff, 0.5);
                    selectionZone.setStrokeStyle(2, 0xff0000)
                    selectionZone.isStroked = true;
                }                
            }
        })
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown && pointer.leftButtonDown()) {
                selectionZone.width = pointer.worldX - selectionZone?.x;
                selectionZone.height = pointer.worldY - selectionZone?.y;
            }
        })
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonReleased()) {
                if (selectionZone) {
                    const selectedUnities = this.children.list.filter((child): child is Unit => {
                        if (isUnity(child)) {
                            const selectionZoneRect = new Phaser.Geom.Rectangle(
                                Math.min(pointer.worldX, selectionZone.x),
                                Math.min(pointer.worldY, selectionZone.y),
                                Math.max(selectionZone.x, pointer.worldX),
                                Math.max(selectionZone.y, pointer.worldY)
                            );
                            const childRect = new Phaser.Geom.Rectangle(child.x, child.y, child.frame.width, child.frame.height);
                            const childInSelectionZone = Phaser.Geom.Intersects.RectangleToRectangle(selectionZoneRect, childRect);
                            return childInSelectionZone;
                        }
                        return false;
                    });
                    this.setSelectedUnits(selectedUnities);
                    selectionZone.destroy()
                }
            }
        })
        this.input.on('pointerupoutside', () => {
            selectionZone.destroy()
        })
    }

    private setCamera() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000);
    }

    private generateMap() {
        const nbOfCellPerLine = parseInt(this.game.config.width + '') / this.cellSize;
        const nbOfCellPerColumn = parseInt(this.game.config.height + '') / this.cellSize;
        for (let row = 0; row < nbOfCellPerColumn; row++) {
            const line = [];
            for (let col = 0; col < nbOfCellPerLine; col++) {
                let tile = Math.floor(Math.random() * (8 - 0)) + 0;
                if (Math.random() < .1) {
                    tile = 50
                }
                line.push(tile);
            }
            this.map.push(line);
        }


        this.Map = this.make.tilemap({
            data: this.map,
            tileWidth: 32,
            tileHeight: 32,
            width: parseInt(this.game.config.width+''),
            height: parseInt(this.game.config.height+''),
        });
        this.tileset = this.Map.addTilesetImage('tilesGrass');
        if (this.tileset ) {
            this.Map.createLayer(0, this.tileset);
        }
        

    }

    private moveUnits(destination: Location) {
        this._selectedUnits.forEach(selectedUnit => {
            selectedUnit.setDestination(destination);
        });
    }

    update(_time: any, delta: number): void {
        this.units.forEach(unity => {
            unity.moveToDestination(delta);            
        })
    }
}
