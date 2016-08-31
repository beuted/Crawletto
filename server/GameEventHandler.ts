/// <reference path="typings/tsd.d.ts" />

import * as util from 'util';
import * as _ from 'lodash';
import * as Action from './Action';
import * as Geo from './utils/Geo';
import {Player} from './Player';
import {Map} from './Map';
import {AisHandler} from './AisHandler';
import {MapsHandler} from './MapsHandler';
import {PlayersHandler} from './PlayersHandler';
import {Server} from './Server';

export class GameEventHandler {
    public static mapsHandler: MapsHandler;
    public static playersHandler: PlayersHandler;
    public static aisHandler: AisHandler;

    constructor() {
        // Init mapsHandler
        GameEventHandler.mapsHandler = new MapsHandler();

        GameEventHandler.playersHandler = new PlayersHandler();

        GameEventHandler.aisHandler = new AisHandler();
    }

    public setEventHandlers() {
        // Socket.IO
        Server.io.on('connection', this.onSocketConnection);
    }

    // New socket connection
    private onSocketConnection(socket/*: SocketIO.Socket*/) {
        util.log('New player has connected: ' + socket.id);

        // Listen for client disconnected
        socket.on('disconnect', GameEventHandler.onClientDisconnect);

        // Listen for new player message
        socket.on('new player', GameEventHandler.onNewPlayer);

        // Listen for move player message
        socket.on('move player', GameEventHandler.onMoveRequest);
    }

    // Socket client has disconnected
    private static onClientDisconnect() {
        var socket: SocketIO.Socket = <any>this;

        util.log('Player has disconnected: ' + socket.id);
        var player = GameEventHandler.playersHandler.getPlayerBySocketId(socket.id);
        var playerMapCoord = player.mapPosition;
        var playerGuid = player.guid;

        // Remove player from playersHandler
        GameEventHandler.playersHandler.removePlayer(playerGuid);

        // Broadcast removed player to connected socket clients on the same map
        var playersOnSameMap = GameEventHandler.playersHandler.getPlayersOnMap(playerMapCoord);
        _.forEach(playersOnSameMap, (player: Player) => {
            Server.io.sockets.connected[player.socketId].emit('remove player', { guid: playerGuid });
        });
    }

    // New player has joined
    private static onNewPlayer(data: any) {
        var socket: SocketIO.Socket = <any>this;

        // Create a new player
        var newPlayer: Player = new Player(socket.id, { x: 7, y: 7 });

        // Broadcast new player to connected socket clients
        var playersOnSameMap = GameEventHandler.playersHandler.getPlayersOnMapWithIdDifferentFrom({ x: 10, y: 10 }, newPlayer.guid);
        _.forEach(playersOnSameMap, (player: Player) => {
            Server.io.sockets.connected[player.socketId].emit('new player', newPlayer.toMessage());
        });

        // Send existing players & map to the new player
        var playersOnSameMapJson: any[] = [];
        _.forEach(playersOnSameMap, (player: Player) => {
            playersOnSameMapJson.push(player.toMessage());
        });

        var map = GameEventHandler.mapsHandler.getMap({ x: 0, y: 0 });
        socket.emit('init player', { player: newPlayer.toMessage(), existingPlayers: playersOnSameMapJson, map: map })

        // Add new player to the players array
        GameEventHandler.playersHandler.addPlayer(newPlayer);
    }

    // Player has moved
    private static onMoveRequest(msg: {vector: Geo.IPoint }) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var movedPlayer: Player = GameEventHandler.playersHandler.getPlayerBySocketId(socket.id);

        // Player should exist
        if (!movedPlayer) {
            util.log('[Error: "move player"] Player not found sId: ' + socket.id);
            return;
        }

        var newPosition: Geo.IPoint = { x: movedPlayer.gridPosition.x + msg.vector.x, y: movedPlayer.gridPosition.y + msg.vector.y };

        // next case should be walkable
        Geo.Tools.distance
        if (!movedPlayer.map.isCellWalkable(newPosition)) {
           util.log('[Error: "move player"] Player (sId: ' + socket.id + ') asked for non-walkable tile');
           return;
       }

        // request move
        movedPlayer.planAction(new Action.Move(newPosition));
    }
}
