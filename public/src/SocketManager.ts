import * as _ from 'lodash';
import * as SocketIOClient from 'socket.io-client'
import { GameContext } from './GameContext';
import { Character } from './Character';
import { RemoteCharactersCollection } from './RemoteCharactersCollection';

export class SocketManager {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io();
        this.socket.on('connect', this.onSocketConnected.bind(this));                    // Socket connection successful
        this.socket.on('disconnect', this.onSocketDisconnect.bind(this));                // Socket disconnection
        this.socket.on('new character', this.onNewCharacter.bind(this));                 // New character message received
        this.socket.on('init player', this.onInitPlayer.bind(this));                     // Character removed message received
        this.socket.on('move player', this.onMovePlayer.bind(this));                     // Character move message received
        this.socket.on('change map player', this.onChangeMapCharacter.bind(this));       // Character removed message received
        this.socket.on('remove character', this.onRemoveCharacter.bind(this));           // Character removed message received
        this.socket.on('attack character', this.onAttackCharacter.bind(this));           // Character removed message received
        this.socket.on('update items', this.onUpdateItems.bind(this));           // Character removed message received
    }

    // ######## Socket messages sent########

    public requestCharacterMove(vector: { x: number, y: number }) {
        this.socket.emit('move player', { vector: vector });
    }

    public requestCharacterAttack(guid: string) {
        this.socket.emit('attack character', { guid: guid });
    }

    public requestCharacterPickup(guid: string) {
        this.socket.emit('pickup item', { guid: guid })
    }

    // ######## Socket messages received ########

    // Socket connected
    private onSocketConnected() {
        console.debug('Connected to socket server as ' + (<any>this.socket.io).engine.id);

        // Send local player data to the game server
        this.socket.emit('new player', {});
    }

    // Socket disconnected
    private onSocketDisconnect() {
        console.debug('Disconnected from socket server');
    }

    // New character (TODO: add save guid to data)
    private onNewCharacter(data: any) {
        console.debug('New character on map: ' + JSON.stringify(data));

        // Add new character to the remote characters array
        GameContext.remoteCharactersCollection.addFromJson(data);
    }

    // Init player
    private onInitPlayer(data: { player: any, characters: any[], items: any[], map: any }) {
        console.debug('Init player: ' + JSON.stringify(data));

        // Load current map
        GameContext.map.changeMap(data.map);

        // Register current character
        GameContext.player = new Character(data.player.gridPosition, data.player.mapPosition, data.player.guid, data.player.hp, data.player.type, true);
        GameContext.remoteCharactersCollection.add(GameContext.player);

        // Load characters on current map
        GameContext.remoteCharactersCollection.addAllFromJson(data.characters);

        // Load items on current map
        GameContext.remoteItemsCollection.addAllFromJson(data.items);
    }

    // Move character
    private onMovePlayer(data: { guid: string, position: Phaser.Point }) {
        GameContext.remoteCharactersCollection.moveByGuid(data.guid, data.position)
    }

    // Character changed map
    private onChangeMapCharacter(data: { guid: string, gridPosition: { x: number, y: number }, characters: any[], items: any[], map: any }) {
        if (GameContext.player.guid === data.guid) {
            console.debug('Character changed map: ' + JSON.stringify(data));
            // change player direction
            var newMapPosition = new Phaser.Point(data.map.position.x, data.map.position.y);
            var vector = Phaser.Point.subtract(newMapPosition, GameContext.player.mapPosition);
            GameContext.player.changeDirection(vector);

            // Change map and move to dest position on it
            GameContext.map.changeMap(data.map);
            GameContext.player.moveInstant(new Phaser.Point(data.gridPosition.x, data.gridPosition.y));
            GameContext.player.mapPosition = newMapPosition;

            // refresh players on map
            GameContext.remoteCharactersCollection.removeAllButPlayer();
            GameContext.remoteCharactersCollection.addAllFromJson(data.characters);

            // refresh items on map
            GameContext.remoteItemsCollection.removeAll();
            GameContext.remoteItemsCollection.addAllFromJson(data.items);
        } else {
            console.error('Character received a "changed map" for another id: ' + JSON.stringify(data));
        }
    }

    // Remove character
    private onRemoveCharacter(data: { guid: string }) {
        console.debug('Character removed from map: ' + data.guid);
        // Check if the removed character is you
        if (data.guid == GameContext.player.guid) {
            // TODO: handle current player death!
            alert('You died!! (Stop playing or it will bug ATM :D)');
        } else {
            // Remove character from remoteCharacter
            GameContext.remoteCharactersCollection.remove(data.guid);
        }
    }

    // Attack character
    private onAttackCharacter(data: { attackedGuid: string, attackingGuid: string, hp: number}) {
        console.debug('Character attacked : ' + data.attackingGuid + ', final hp: ' + data.hp);
        var attackedlayer = GameContext.remoteCharactersCollection.get(data.attackedGuid);
        var attackingPlayer = GameContext.remoteCharactersCollection.get(data.attackingGuid);

        var vector = Phaser.Point.subtract(attackedlayer.gridPosition, attackingPlayer.gridPosition)
        attackingPlayer.changeDirection(vector);
        attackingPlayer.attack();
        attackedlayer.hp = data.hp;
    }

    // Update items on map
    public onUpdateItems(data: { items: any[]}) {
        // refresh items on map
        GameContext.remoteItemsCollection.removeAll();
        GameContext.remoteItemsCollection.addAllFromJson(data.items);
    }

}
