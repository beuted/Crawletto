/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Character } from './Character';
import { Move } from './Action';
import { GameEventHandler } from './GameEventHandler';

export class CharactersHandler<T extends Character> {

    public characters: T[];

    constructor() {
        this.characters = [];
    }

    public executeActions() {
        _.forEach(this.characters, character => {
            character.executeAction();
        });
    }

    public getCharacters() {
        return this.characters;
    }

    // Find character by GUID
    public getCharacter(guid: string): Character {
        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].guid == guid)
                return this.characters[i];
        };

        return null;
    }

    public getCharactersOnMapAtPosition(coordMap: Geo.IPoint, coord: Geo.IPoint): T[] {
        return _.filter(this.characters, function (character) {
            return character.mapPosition.x == coordMap.x && character.mapPosition.y == coordMap.y
                && character.gridPosition.x == coord.x && character.gridPosition.y == coord.y;
        });
    }

    public getCharactersOnMap(mapCoord: Geo.IPoint): T[] {
        return _.filter(this.characters, function (character) {
            return character.mapPosition.x == mapCoord.x && character.mapPosition.y == mapCoord.y;
        });
    }
}
