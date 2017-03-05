import * as _ from 'lodash';
import * as Geo from '../utils/Geo';
import { Player } from '../Player';
import { CharactersCollection } from './CharactersCollection';

export class PlayersCollection extends CharactersCollection<Player> {
    constructor() {
        super();
    }

    public getPlayersOnMapWithIdDifferentFrom(coord: Geo.IPoint, guid: string) {
        return _.filter(this.elements, function (player) {
            return player.mapPosition.x == coord.x && player.mapPosition.y == coord.y && player.guid !== guid;
        });
    }

    // Find player by SocketId
    public getPlayerBySocketId(socketId: string): Player {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].socketId == socketId)
                return this.elements[i];
        };

        return null;
    }

    public allPlayersPlannedAction(): boolean {
        return _.every(this.elements, player => player.havePlannedAction());
    }
}
