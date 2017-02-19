/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Item } from './Item';
import { RemoteElementsCollection } from './RemoteElementsCollection';

export class RemoteItemsCollection extends RemoteElementsCollection<Item> {
    constructor() {
        super();
    }

    public addFromJson(itemJson: { gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, guid: string, type: string }) {
        var remoteItem = new Item(itemJson.gridPosition,
                                  itemJson.mapPosition,
                                  itemJson.guid,
                                  itemJson.type);
        this.add(remoteItem);
    }

    public addAllFromJson(itemsJson: { gridPosition: Phaser.Point, mapPosition: { x: number, y: number }, guid: string, type: string }[]) {
        _.forEach(itemsJson, function (itemJson: any) {
            this.addFromJson(itemJson);
        }, this);
    }
}
