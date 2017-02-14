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

    public removeCharacters(guids: string[]) {
        _.remove(this.characters, (char) => { return _.includes(guids, char.guid); });
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
        // list of characters to remove
        var charactersToRemove = [];

        _.forEach(this.characters, character => {
            // Remove characters with hp below 0
            if (character.hp <= 0) {
                console.log('removing: ' + character.guid);
                charactersToRemove.push(character);

                var playersToNotify: Player[] = GameEventHandler.playersHandler.getCharactersOnMap(character.mapPosition);
                _.forEach(playersToNotify, notifiedPlayer => {
                    Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove character', { guid: character.guid });
                });
            }

        });

        this.removeCharacters(_.map(charactersToRemove, c => c.guid));
    }
}
