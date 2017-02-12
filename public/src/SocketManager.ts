/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { Player } from './Player';
import { RemotePlayersManager } from './RemotePlayersManager';

export class SocketManager {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io();
        this.socket.on('connect', this.onSocketConnected.bind(this));       // Socket connection successful
        this.socket.on('disconnect', this.onSocketDisconnect.bind(this));   // Socket disconnection
        this.socket.on('new player', this.onNewPlayer.bind(this));          // New player message received
        this.socket.on('init player', this.onInitPlayer.bind(this));    // Player removed message received
        this.socket.on('move player', this.onMovePlayer.bind(this));        // Player move message received
        this.socket.on('change map player', this.onChangeMapPlayer.bind(this));    // Player removed message received
        this.socket.on('remove player', this.onRemovePlayer.bind(this));    // Player removed message received
        this.socket.on('attack player', this.onAttackPlayer.bind(this));    // Player removed message received
    }

    public requestPlayerMove(vector: { x: number, y: number }) {
        this.socket.emit('move player', { vector: vector });
    }

    public requestPlayerAttack(guid: string) {
        this.socket.emit('attack player', { guid: guid });
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

    // New player (TODO: add save guid to data)
    private onNewPlayer(data: any) {
        console.debug('New player on map: ' + JSON.stringify(data));

        // Add new player to the remote players array
        GameContext.remotePlayersManager.addFromJson(data);
    }

    // Init player
    private onInitPlayer(data: { player: any, existingPlayers: any[], map: any }) {
        console.debug('Init player: ' + JSON.stringify(data));

        // Load current map
        GameContext.map.changeMap(data.map);

        // Register current player
        GameContext.player = new Player(data.player.gridPosition.x, data.player.gridPosition.y, data.player.guid, data.player.hp, 'knight', true);

        // Load players on current map
        _.forEach(data.existingPlayers, (player) => {
            GameContext.remotePlayersManager.addFromJson(player);
        });
    }

    // Move player
    private onMovePlayer(data: { guid: string, position: Phaser.Point }) {
        if (GameContext.player.guid === data.guid) {
            GameContext.player.move(data.position);
            return;
        }

        GameContext.remotePlayersManager.moveByGuid(data.guid, data.position)
    }

    // Player changed map
    private onChangeMapPlayer(data: { guid: string, gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number }, players: any[], map: any[][] }) {
        if (GameContext.player.guid === data.guid) {
            console.debug('Player changed map: ' + JSON.stringify(data));
            GameContext.map.changeMap(data.map);
            GameContext.player.moveInstant(new Phaser.Point(data.gridPosition.x, data.gridPosition.y));
            GameContext.remotePlayersManager.removeAll();
            GameContext.remotePlayersManager.addAllFromJson(data.players);
        } else {
            console.error('Player received a "changed map" for another id: ' + JSON.stringify(data));
        }
    }

    // Remove player
    private onRemovePlayer(data: any) {
        console.debug('Player removed from map: ' + data.guid);
        // Remove player from remotePlayers
        GameContext.remotePlayersManager.removeByGuid(data.guid);
    }

    // Attack player
    private onAttackPlayer(data: { guid: string, hp: number}) {
        console.debug('Player attacked : ' + data.guid);
        // Remove player from remotePlayers
        GameContext.remotePlayersManager.removeByGuid(data.guid); //TODO
    }

}
