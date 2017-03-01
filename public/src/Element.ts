import { GameContext } from './GameContext';
import { Map } from './Map';

export class Element {
    public sprite: Phaser.Sprite;
    public gridPosition: Phaser.Point;
    public mapPosition: Phaser.Point;
    public guid: string;
    public type: string;

    constructor(gridPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, guid: string, type: string) {
        this.type = type;
        this.gridPosition = new Phaser.Point(gridPosition.x, gridPosition.y);
        this.mapPosition = new Phaser.Point(mapPosition.x, mapPosition.y);
        this.guid = guid;
    }

    public destroy() {
        this.sprite.destroy();
    }
}
