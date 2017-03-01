import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Character } from './Character';
import { RemoteElementsCollection } from './RemoteElementsCollection';

export class RemoteCharactersCollection extends RemoteElementsCollection<Character> {
    constructor() {
        super();
    }

    public addFromJson(characterJson: { gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, guid: string, hp: number, type: string }) {
        var remoteCharacter = new Character(characterJson.gridPosition,
                                      characterJson.mapPosition,
                                      characterJson.guid,
                                      characterJson.hp,
                                      characterJson.type);
        this.add(remoteCharacter);
    }

    public addAllFromJson(charactersJson: { gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, guid: string, hp: number, type: string }[]) {
        charactersJson.forEach((characterJson: any) => {
            this.addFromJson(characterJson);
        });
    }

    public removeAllButPlayer() {
        _.forEach(this.remoteElements, function (remoteCharacter) {
            if (remoteCharacter.guid != GameContext.player.guid)
                remoteCharacter.destroy();
        });
        this.add(GameContext.player);
    }

    public moveByGuid(guid: string, destPoint: any) {
        var characterToMove = this.get(guid);

        if (!characterToMove) {
            console.warn('Character not found: ' + guid);
            return;
        };

        // Update character position
        characterToMove.move(destPoint)
    }
}
