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

        // Change player map if player as reach map borders in it's last action
        var mapSize: Geo.IPoint = char.map.getSize();
        var newMapPosition: Geo.IPoint = { x: char.mapPosition.x, y: char.mapPosition.y }
        var newGridPosition: Geo.IPoint = { x: char.gridPosition.x, y: char.gridPosition.y }

        if (this.destination.x <= 0) {
            newMapPosition.x--;
            newGridPosition.x = mapSize.x - 2;
        } else if (this.destination.x >= mapSize.x - 1) {
            newMapPosition.x++;
            newGridPosition.x = 1;
        }

        if (this.destination.y <= 0) {
            newMapPosition.y--;
            newGridPosition.y = mapSize.y - 2;
        } else if (this.destination.y >= mapSize.y - 1) {
            newMapPosition.y++;
            newGridPosition.y = 1;
        }

        var map = GameEventHandler.mapsHandler.getMap(newMapPosition);

        if ((char.mapPosition.x != newMapPosition.x || char.mapPosition.y != newMapPosition.y) && !!map) {
            var changeMapAction = new ChangeMap(newMapPosition, newGridPosition);
            changeMapAction.execute(char);
            return;
        }

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

export class Attack implements IAction {
    public attackedPlayerGuid: string;

    constructor(playerGuid: string) {
        this.attackedPlayerGuid = playerGuid;
    }

    public execute(char: Character) {
        var attackedPlayer = GameEventHandler.playersHandler.getCharacter(this.attackedPlayerGuid)
                             || GameEventHandler.aisHandler.getCharacter(this.attackedPlayerGuid);

        // Compute damage
        var damage = 10;

        // Impact player aimed 
        attackedPlayer.hp -= damage;

        // Notify players on the same map
        var playersToNotify: Player[] = GameEventHandler.playersHandler.getCharactersOnMap(char.mapPosition);
        _.forEach(playersToNotify, notifiedPlayer => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('attack player', {
                guid: this.attackedPlayerGuid,
                hp: attackedPlayer.hp
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

    public execute(char: Character) {
        var newMap = GameEventHandler.mapsHandler.getMap(this.destMap);

        var playersOnPrevMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(char.mapPosition, char.guid);
        var playersOnDestMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(this.destMap, char.guid);
        var aisOnDestMap = GameEventHandler.aisHandler.getCharactersOnMap(this.destMap);

        char.gridPosition = this.destCase;
        char.mapPosition = this.destMap;
        char.gridPosition = this.destCase;

        // Send the change map message to the player changing map
        let aisOnMapMessage = _.map(aisOnDestMap, ai => ai.toMessage());
        let playersOnDestMapMessage = _.map(playersOnDestMap, player => player.toMessage());

        if (char instanceof Player)
            Server.io.sockets.connected[char.socketId].emit('change map player', {
                guid: char.guid,
                gridPosition: { x: char.gridPosition.x, y: char.gridPosition.y },
                mapPosition: { x: char.mapPosition.x, y: char.mapPosition.y },
                players: playersOnDestMapMessage.concat(aisOnMapMessage),
                map: newMap.toMessage()
            });

        // Notify players from previous map
        _.forEach(playersOnPrevMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove player', char.toMessage());
        }, this);

        // Notify players from detination map
        _.forEach(playersOnDestMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('new player', char.toMessage());
        }, this);
    }
}
