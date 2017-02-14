/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Character } from './Character';
import { RemoteCharactersManager } from './RemoteCharactersManager';

export class SocketManager {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io();
        this.socket.on('connect', this.onSocketConnected.bind(this));                    // Socket connection successful
        this.socket.on('disconnect', this.onSocketDisconnect.bind(this));                // Socket disconnection
        this.socket.on('new character', this.onNewCharacter.bind(this));                 // New character message received
        this.socket.on('init player', this.onInitPlayer.bind(this));               // Character removed message received
        this.socket.on('move player', this.onMovePlayer.bind(this));               // Character move message received
        this.socket.on('change map player', this.onChangeMapCharacter.bind(this));    // Character removed message received
        this.socket.on('remove character', this.onRemoveCharacter.bind(this));           // Character removed message received
        this.socket.on('attack character', this.onAttackCharacter.bind(this));           // Character removed message received
    }

    public requestCharacterMove(vector: { x: number, y: number }) {
        this.socket.emit('move player', { vector: vector });
    }

    public requestCharacterAttack(guid: string) {
        this.socket.emit('attack character', { guid: guid });
    }

    // Socket connected
    private onSocketConnected() {
        console.debug('Connected to socket server as ' + this.socket.io.engine.id);

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
        GameContext.remoteCharactersManager.addFromJson(data);
    }

    // Init player
    private onInitPlayer(data: { player: any, existingCharacters: any[], map: any }) {
        console.debug('Init player: ' + JSON.stringify(data));

        // Load current map
        GameContext.map.changeMap(data.map);

        // Register current character
        GameContext.player = new Character(data.player.gridPosition, data.player.guid, data.player.hp, data.player.type, true);

        // Load characters on current map
        _.forEach(data.existingCharacters, (character: any) => {
            GameContext.remoteCharactersManager.addFromJson(character);
        });
    }

    // Move character
    private onMovePlayer(data: { guid: string, position: Phaser.Point }) {
        if (GameContext.player.guid === data.guid) {
            GameContext.player.move(data.position);
            return;
        }

        GameContext.remoteCharactersManager.moveByGuid(data.guid, data.position)
    }

    // Character changed map
    private onChangeMapCharacter(data: { guid: string, gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, characters: any[], map: any[][] }) {
        if (GameContext.player.guid === data.guid) {
            console.debug('Character changed map: ' + JSON.stringify(data));
            GameContext.map.changeMap(data.map);
            GameContext.player.moveInstant(new Phaser.Point(data.gridPosition.x, data.gridPosition.y));
            GameContext.remoteCharactersManager.removeAll();
            GameContext.remoteCharactersManager.addAllFromJson(data.characters);
        } else {
            console.error('Character received a "changed map" for another id: ' + JSON.stringify(data));
        }
    }

    // Remove character
    private onRemoveCharacter(data: any) {
        console.debug('Character removed from map: ' + data.guid);
        // Remove character from remoteCharacter
        GameContext.remoteCharactersManager.removeByGuid(data.guid);
    }

    // Attack character
    private onAttackCharacter(data: { guid: string, hp: number}) {
        console.debug('Character attacked : ' + data.guid);

        GameContext.remoteCharactersManager.getByGuid(data.guid).hp -= data.hp;
    }

}
