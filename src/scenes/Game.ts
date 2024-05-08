import { createVillagerAnims } from '../anims/VillagerAnims';
import { isUnit, Unit } from '../objects/Unit';
import '../objects/Villager';
import { Scene } from 'phaser';
import { Task as Task } from '../types/Task';
export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset | null;

    private readonly units: Unit[] = []
    private _selectedUnits: Unit[] = [];
    objects: Phaser.Physics.Arcade.StaticGroup;

    shiftDown = false;

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
            if (nextZoomLevel >= 1 && nextZoomLevel < 2.5) {
                this.camera.setZoom(this.camera.zoom + zoomLevel);
            }
        });
    }

    private onClick() {
        this.input.keyboard?.on('keydown-SHIFT', () => {
            this.shiftDown = true;
            
        })
        this.input.keyboard?.on('keyup-SHIFT', () => {
            this.shiftDown = false;
        })
        let selectionZone: Phaser.GameObjects.Rectangle;
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objects: Phaser.GameObjects.GameObject[]) => {
            if (pointer.rightButtonDown()) {                
                if (this._selectedUnits.length > 0) {
                    const destination = { x: pointer.worldX, y: pointer.worldY };
                    const task: Task = {type: 'moveTo', status: 'waiting', args: destination};
                    this._selectedUnits.forEach(unit => {
                        if (this.shiftDown) { // MAJ+Click
                            unit.taskQueue.add(task);
                        } else {
                            unit.taskQueue.empty();
                            unit.taskQueue.add(task);
                        }
                    });
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
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer): void => {
            if (pointer.isDown && pointer.leftButtonDown()) {
                selectionZone.width = pointer.worldX - selectionZone?.x;
                selectionZone.height = pointer.worldY - selectionZone?.y;
            }
            if (pointer.x > 0 && pointer.x < (Number(this.game.config.width) * 0.1)) {
                this.camera.scrollX -= 10;
            }
            if (pointer.x > Number(this.game.config.width) * 0.9 && pointer.x < Number(this.game.config.width)) {
                this.camera.scrollX += 10;
            }
            if (pointer.y > 0 && pointer.y < Number(this.game.config.height) * 0.1) {
                this.camera.scrollY -= 10;
            }
            if (pointer.y > Number(this.game.config.height) * 0.9 && pointer.y < Number(this.game.config.height)) {
                this.camera.scrollY += 10;
            }
        });
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer): void => {
            if (pointer.leftButtonReleased()) {
                if (selectionZone) {
                    const selectedUnities: Unit[] = this.children.list.filter((child): child is Unit => {
                        if (isUnit(child)) {
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
                    selectionZone.destroy();
                }
            }
        })
        this.input.on('pointerupoutside', (): void => {
            selectionZone.destroy();
        })
    }

    private setCamera(): void {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000);
        this.camera.setBounds(0,0, Number(this.game.config.width), Number(this.game.config.height));
    }

    private generateMap(): void {
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('rts-phaset-tileset_0001', 'tiles');
        if (this.tileset ) {
            this.map.createLayer('background', this.tileset);
            const objectLayer = this.map.getObjectLayer('objects');
            const staticObjects = objectLayer?.objects.map(object => {
                const sprite = this.add.sprite(Number(object.x), Number(object.y), 'tiles', object.gid!-1).setOrigin(0, 0.5);
                return sprite;
            }) ?? [];
            this.objects = this.physics.add.staticGroup(staticObjects).setCollisionCategory(2);
            this.physics.add.collider(this.units, this.objects, () => console.log('col'))
            console.log(this.physics.world.colliders);
            this.objects.addCollidesWith(1)
            
        }
    }

    update(_time: any, delta: number): void {
        this.units.forEach(unit => {
            unit.doThings(delta);            
        })
    }
}
