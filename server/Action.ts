/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {GameEventHandler} from "./GameEventHandler";
import {Player} from "./Player";
import {Server} from "./Server";

export interface IAction {
    execute(player: Player);
}

export class Move implements IAction {
    public destination: Geo.IPoint;

    constructor(destination: Geo.IPoint) {
        this.destination = destination;
    }

    public execute(player: Player) {
        player.gridPosition = this.destination;
        var playersToNotify: Player[] = GameEventHandler.playersHandler.getPlayersOnMap(player.mapPosition);
        _.forEach(playersToNotify, notifiedPlayer => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('move player', {
                guid: player.guid,
                position: { x: this.destination.x, y: this.destination.y }
            });
        });
    }
}


export class ChangeMap implements IAction {
    public destMap: Geo.IPoint;
    public destCase: Geo.IPoint;

    constructor(destMap: Geo.IPoint, destCase: Geo.IPoint) {
        this.destMap = destMap;
        this.destCase = destCase;
    }

    public execute(player: Player) {
        var newMap = GameEventHandler.mapsHandler.getMap(this.destMap);

        var playersOnPrevMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(player.mapPosition, player.guid);
        var playersOnDestMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(this.destMap, player.guid);

        player.gridPosition = this.destCase;
        player.mapPosition = this.destMap;
        player.gridPosition = this.destCase;

        // Send the change map message to the player changing map
        var playersOnDestMapMessage = _.map(playersOnDestMap, player => player.toMessage());

        Server.io.sockets.connected[player.socketId].emit('change map player', {
            guid: player.guid,
            gridPosition: { x: player.gridPosition.x, y: player.gridPosition.y },
            mapPosition: { x: player.mapPosition.x, y: player.mapPosition.y },
            players: playersOnDestMapMessage,
            map: newMap.toMessage()
        });

        // Notify players from previous map
        _.forEach(playersOnPrevMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove player', player.toMessage());
        }, this);

        // Notify players from detination map
        _.forEach(playersOnDestMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('new player', player.toMessage());
        }, this);
    }
}
