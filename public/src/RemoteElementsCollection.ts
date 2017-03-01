/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Element } from './Element';

export class RemoteElementsCollection<T extends Element>  {
    protected remoteElements: T[];

    constructor() {
        this.remoteElements = [];
    }

    public add(e: T) {
        this.remoteElements.push(e);
    }

    //TODO: put that in Element class
    //public addFromJson(characterJson: { gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, guid: string, hp: number, type: string }) {
    //    var remoteCharacter = new T(characterJson.gridPosition,
    //                                  characterJson.mapPosition,
    //                                  characterJson.guid,
    //                                  characterJson.hp,
    //                                  characterJson.type);
    //    this.add(remoteCharacter);
    //}

    //public addAllFromJson(charactersJson: { gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, guid: string, hp: number, type: string }[]) {
    //    _.forEach(charactersJson, function (characterJson: any) {
    //        this.addFromJson(characterJson);
    //    }, this);
    //}

    public remove(guid: string) {
        var removeCharacter = this.get(guid);

        if (!removeCharacter) {
            console.warn('Element not found: ' + guid);
            return;
        }

        removeCharacter.destroy();
        this.remoteElements.splice(this.remoteElements.indexOf(removeCharacter), 1);
    }

    public removeAll() {
        _.forEach(this.remoteElements, function (remoteCharacter) {
            remoteCharacter.destroy();
        });
        this.remoteElements = [];
    }     


    public getAt(gridCoord: Phaser.Point): T[] {
        return _.filter(this.remoteElements, item => item.gridPosition.equals(gridCoord));
    }

    // Find element by GUID
    public get(guid: string): T {
        for (var i = 0; i < this.remoteElements.length; i++) {
            if (this.remoteElements[i].guid == guid)
                return this.remoteElements[i];
        };

        return null;
    };
}
