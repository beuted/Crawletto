/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as util from 'util';
import * as Geo from './utils/Geo';
import { Player } from './Player';
import { CharactersHandler } from './CharactersHandler';

export class PlayersHandler extends CharactersHandler<Player> {
    constructor() {
        super();
    }

    public addPlayer(player: Player) {
        this.characters.push(player);
    }

    public removePlayer(playerId: string) {
        var removePlayer = this.getCharacter(playerId);
        if (!removePlayer) {
            console.error('[removePlayer] Player not found: ' + playerId);
            return;
        }

        this.characters.splice(this.characters.indexOf(<Player>removePlayer), 1);
    }

    public getPlayersOnMapWithIdDifferentFrom(coord: Geo.IPoint, guid: string) {
        return _.filter(this.characters, function (player) {
            return player.mapPosition.x == coord.x && player.mapPosition.y == coord.y && player.guid !== guid;
        });
    }

    // Find player by GUID
    public getPlayer(guid: string): Player {
        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].guid == guid)
                return this.characters[i];
        };

        return null;
    }

    // Find player by SocketId
    public getPlayerBySocketId(socketId: string): Player {
        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].socketId == socketId)
                return this.characters[i];
        };

        return null;
    }

    public allPlayersPlannedAction(): boolean {
        return _.every(this.characters, player => player.havePlannedAction());
    }
}
