import { GameContext } from './GameContext';
import { Map } from './Map';
import { Element } from './Element';

export class Item extends Element {
    constructor(gridPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, guid: string, type: string) {
        super(gridPosition, mapPosition, guid, type);

        // setting up the sprite
        this.sprite = GameContext.instance.add.sprite(gridPosition.x * 32, gridPosition.y * 32, 'items-tileset', type, Map.itemGroup);
        this.sprite.anchor.set(0, 0);
        this.sprite.scale.set(2);
        this.sprite.smoothed = false;
    }
}
