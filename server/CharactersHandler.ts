/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Character } from './Character';
import { Player } from './Player';
import { Move } from './Action';
import { GameEventHandler } from './GameEventHandler';
import { Server } from './Server';

export class CharactersHandler<T extends Character> {

    public characters: T[];

    constructor() {
        this.characters = [];
    }

    public executeActions() {
        _.forEach(this.characters, character => {
            character.executeAction();
        });
        this.update();
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

    public removeCharacter(guid: string) {
        _.remove(this.characters, (char) => { char.guid == guid; });
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

    private update() {
        _.forEach(this.characters, character => {
            // Remove players with hp below 0
            if (character.hp <= 0) {
                this.removeCharacter(character.guid);
                var playersToNotify: Player[] = GameEventHandler.playersHandler.getCharactersOnMap(character.mapPosition);
                _.forEach(playersToNotify, notifiedPlayer => {
                    Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove character', { guid: character.guid });
                });
            }

        });
    }
}
