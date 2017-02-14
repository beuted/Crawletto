/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Character } from './Character';

export class RemoteCharactersManager {
    private remoteCharacters: Character[];

    constructor() {
        this.remoteCharacters = [];
    }

    public add(p: Character) {
        this.remoteCharacters.push(p);
    }

    public addFromJson(characterJson: { gridPosition: Phaser.Point, guid: string, hp: number }) {
        var remoteCharacter = new Character(characterJson.gridPosition.x,
                                      characterJson.gridPosition.y,
                                      characterJson.guid,
                                      characterJson.hp,
                                      'zombie');
        this.add(remoteCharacter);
    }

    public addAllFromJson(charactersJson: { gridPosition: Phaser.Point, guid: string }[]) {
        _.forEach(charactersJson, function (characterJson: any) {
            this.addFromJson(characterJson);
        }, this);
    }

    public removeByGuid(guid: string) {
        var removeCharacter = this.getByGuid(guid);

        // Character not found
        if (!removeCharacter) {
            console.warn('Character not found: ' + guid);
            return;
        };

        removeCharacter.destroy();
        this.remoteCharacters.splice(this.remoteCharacters.indexOf(removeCharacter), 1);
    }

    public removeAll() {
        _.forEach(this.remoteCharacters, function (remoteCharacter) {
            remoteCharacter.destroy();
        });
        this.remoteCharacters = []
    }

    public moveByGuid(guid: string, destPoint: any) {
        var characterToMove = this.getByGuid(guid);

        if (!characterToMove) {
            console.warn('Character not found: ' + guid);
            return;
        };

        // Update character position
        characterToMove.move(destPoint)
    }

    public getCharacterAt(gridCoord: Phaser.Point) {
        for (var i = 0; i < this.remoteCharacters.length; i++) {
            if (Phaser.Point.equals(this.remoteCharacters[i].gridPosition, gridCoord)) {
                return this.remoteCharacters[i];
            }
        }

        return null
    }

    // Find character by GUID
    public getByGuid(guid): Character {
        for (var i = 0; i < this.remoteCharacters.length; i++) {
            if (this.remoteCharacters[i].guid == guid)
                return this.remoteCharacters[i];
        };

        return null;
    };
}
