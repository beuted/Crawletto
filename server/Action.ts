/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { GameEventHandler } from './GameEventHandler';
import { Character } from './Character';
import { Player } from './Player';
import { Server } from './Server';

export interface IAction {
    execute(char: Character);
}

export class Move implements IAction {
    public destination: Geo.IPoint;

    constructor(destination: Geo.IPoint) {
        this.destination = destination;
    }

    public execute(char: Character) {
        // next case should be walkable
        if (!char.map.isCellWalkable(this.destination))
            return;

        char.gridPosition = this.destination;


        var playersToNotify: Player[] = GameEventHandler.playersHandler.getCharactersOnMap(char.mapPosition);
        _.forEach(playersToNotify, notifiedPlayer => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('move player', {
                guid: char.guid,
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
        var aisOnDestMap = GameEventHandler.aisHandler.getCharactersOnMap(this.destMap);

        player.gridPosition = this.destCase;
        player.mapPosition = this.destMap;
        player.gridPosition = this.destCase;

        // Send the change map message to the player changing map
        let aisOnMapMessage = _.map(aisOnDestMap, ai => ai.toMessage());
        let playersOnDestMapMessage = _.map(playersOnDestMap, player => player.toMessage());

        Server.io.sockets.connected[player.socketId].emit('change map player', {
            guid: player.guid,
            gridPosition: { x: player.gridPosition.x, y: player.gridPosition.y },
            mapPosition: { x: player.mapPosition.x, y: player.mapPosition.y },
            players: playersOnDestMapMessage.concat(aisOnMapMessage),
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
