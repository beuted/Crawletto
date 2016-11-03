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

    public getCharactersOnMap(coord: Geo.IPoint): T[] {
        return _.filter(this.characters, function (character) {
            return character.mapPosition.x == coord.x && character.mapPosition.y == coord.y;
        });
    }
}
