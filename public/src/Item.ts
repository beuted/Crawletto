/// <reference path="../typings/index.d.ts" />

import { GameContext } from "./GameContext";
import { Map } from "./Map";

export class Item {
    public sprite: Phaser.Sprite;
    public gridPosition: Phaser.Point;
    public mapPosition: Phaser.Point;
    public guid: string;
    public type: string;

    constructor(gridPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, guid: string, type: string) {
        this.type = type;
        // setting up the sprite
        this.sprite = GameContext.instance.add.sprite(gridPosition.x * 32, gridPosition.y * 32, 'items-tileset', type, Map.itemGroup);
        this.sprite.anchor.set(0, 0);
        this.sprite.scale.set(2);
        this.sprite.smoothed = false;

        // setting up custom parameters
        this.gridPosition = new Phaser.Point(gridPosition.x, gridPosition.y);
        this.mapPosition = new Phaser.Point(mapPosition.x, mapPosition.y);
        this.guid = guid;
    }

    public destroy() {
        this.sprite.destroy();
    }
}
