/// <reference path="typings/tsd.d.ts" />

import * as util from "util";
import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {Player} from "./Player";

export class PlayersHandler {
    private players: Player[];

    constructor() {
        this.players = [];
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerId: string) {
        var removePlayer = this.getPlayer(playerId);
        if (!removePlayer) {
            console.error('[removePlayer] Player not found: ' + playerId);
            return;
        }

        this.players.splice(this.players.indexOf(removePlayer), 1);
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getPlayersOnMap(coord: Geo.IPoint): Player[] {
        return _.filter(this.players, function(player) {
            return player.mapPosition.x == coord.x && player.mapPosition.y == coord.y;
        });
    }

    public getPlayersOnMapWithIdDifferentFrom(coord: Geo.IPoint, guid: string) {
        return _.filter(this.players, function(player) {
            return player.mapPosition.x == coord.x && player.mapPosition.y == coord.y && player.guid !== guid;
        });
    }

    // Find player by GUID
    public getPlayer(guid: string): Player {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].guid == guid)
                return this.players[i];
        };

        return null;
    }

    // Find player by SocketId
    public getPlayerBySocketId(socketId: string): Player {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].socketId == socketId)
                return this.players[i];
        };

        return null;
    }
}
