import * as _ from 'lodash';
import { Character } from '../Character';
import { Player } from '../Player';
import { Move } from '../Action';
import { GameEventHandler } from '../GameEventHandler';
import { ElementsHandler } from './ElementsHandler';
import { Server } from '../Server';

export class CharactersHandler<T extends Character> extends ElementsHandler<T> {
    constructor() {
        super();
    }

    public executeActions() {
        this.elements.forEach(elt => {
            elt.executeAction();
        });
        this.update();
    }

    private update() {
        // list of characters to remove
        var charactersToRemove: T[] = [];

        this.elements.forEach(character => {
            // Remove characters with hp below 0
            if (character.hp <= 0) {
                console.log('removing: ' + character.guid);
                charactersToRemove.push(character);

                var playersToNotify: Player[] = GameEventHandler.playersHandler.getAllOnMap(character.mapPosition);
                playersToNotify.forEach(notifiedPlayer => {
                    Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove character', { guid: character.guid });
                });
            }

        });

        this.removeSeveral(_.map(charactersToRemove, c => c.guid));
    }
}