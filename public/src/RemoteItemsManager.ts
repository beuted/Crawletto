/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Item } from './Item';

export class RemoteItemsManager {
    private remoteItems: Item[];

    constructor() {
        this.remoteItems = [];
    }

    public add(p: Item) {
        this.remoteItems.push(p);
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

    public removeAll() {
        _.forEach(this.remoteItems, function (remoteCharacter) {
            remoteCharacter.destroy();
        });
        this.remoteItems = [];
    }

    public removeByGuid(guid: string) {
        var removeItem = this.getByGuid(guid);

        if (!removeItem) {
            console.warn('Item not found: ' + guid);
            return;
        }

        removeItem.destroy();
        this.remoteItems.splice(this.remoteItems.indexOf(removeItem), 1);
    }

    public getItemsAt(gridCoord: Phaser.Point) {
        return _.filter(this.remoteItems, item => item.gridPosition == gridCoord);
    }

    // Find item by GUID
    public getByGuid(guid): Item {
        for (var i = 0; i < this.remoteItems.length; i++) {
            if (this.remoteItems[i].guid == guid)
                return this.remoteItems[i];
        };

        return null;
    };
}
