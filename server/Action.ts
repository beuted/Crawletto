/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { GameEventHandler } from './GameEventHandler';
import { Character } from './Character';
import { Player } from './Player';
import { Server } from './Server';

export interface IAction {
    execute(char: Character): void;
}

export class Move implements IAction {
    public destination: Geo.IPoint;

    constructor(destination: Geo.IPoint) {
        this.destination = destination;
    }

    public execute(char: Character): void {
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

        var playersToNotify: Player[] = GameEventHandler.playersHandler.getAllOnMap(char.mapPosition);
        _.forEach(playersToNotify, notifiedPlayer => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('move player', {
                guid: char.guid,
                position: { x: this.destination.x, y: this.destination.y }
            });
        });
    }
}

export class Attack implements IAction {
    public attackedCharacterGuid: string;
    public attackingCharacterGuid: string;

    constructor(attackedGuid: string, attackingGuid: string) {
        this.attackedCharacterGuid = attackedGuid;
        this.attackingCharacterGuid = attackingGuid;
    }

    public execute(char: Character) {
        var attackedCharacter: Character = <Character>GameEventHandler.playersHandler.get(this.attackedCharacterGuid)
                                        || <Character>GameEventHandler.aisHandler.get(this.attackedCharacterGuid);

        // Compute damage
        var damage = 10;

        if (!attackedCharacter) {
            console.error('Can\'t find attacked character: ' + this.attackedCharacterGuid);
            return;
        }

        // Impact player aimed 
        attackedCharacter.hp -= damage;

        // Notify players on the same map
        var playersToNotify: Player[] = GameEventHandler.playersHandler.getAllOnMap(char.mapPosition);
        _.forEach(playersToNotify, notifiedPlayer => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('attack character', {
                attackedGuid: this.attackedCharacterGuid,
                attackingGuid: this.attackingCharacterGuid,
                hp: attackedCharacter.hp
            });
        });
        
    }
}


export class ChangeMap implements IAction {
    public destMapPosition: Geo.IPoint;
    public destCharacterPosition: Geo.IPoint;

    constructor(destMapPosition: Geo.IPoint, destCharacterPosition: Geo.IPoint) {
        this.destMapPosition = destMapPosition;
        this.destCharacterPosition = destCharacterPosition;
    }

    public execute(char: Character) {
        let newMap = GameEventHandler.mapsHandler.getMap(this.destMapPosition);

        let playersOnPrevMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(char.mapPosition, char.guid);
        let playersOnDestMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom(this.destMapPosition, char.guid);
        let aisOnDestMap = GameEventHandler.aisHandler.getAllOnMap(this.destMapPosition);
        let itemsOnDestMap = GameEventHandler.itemsHandler.getAllOnMap(this.destMapPosition);

        char.gridPosition = this.destCharacterPosition;
        char.mapPosition = this.destMapPosition;
        char.gridPosition = this.destCharacterPosition;

        // Send the change map message to the player changing map
        let aisOnMapMessage = _.map(aisOnDestMap, ai => ai.toMessage());
        let playersOnDestMapMessage = _.map(playersOnDestMap, player => player.toMessage());
        let itemsOnDestMapMessage = _.map(itemsOnDestMap, item => item.toMessage());

        if (char instanceof Player)
            Server.io.sockets.connected[char.socketId].emit('change map player', {
                guid: char.guid,
                gridPosition: { x: char.gridPosition.x, y: char.gridPosition.y },
                characters: playersOnDestMapMessage.concat(aisOnMapMessage),
                items: itemsOnDestMapMessage,
                map: newMap.toMessage()
            });

        // Notify players from previous map
        playersOnPrevMap.forEach((notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('remove character', char.toMessage());
        });

        // Notify players from detination map
        playersOnDestMap.forEach((notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.socketId].emit('new character', char.toMessage());
        });
    }
}
