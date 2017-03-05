import * as util from 'util';
import * as _ from 'lodash';
import * as Action from './Action';
import * as Geo from './utils/Geo';
import { Player } from './Player';
import { Character } from './Character';
import { Item } from './Item';
import { Map } from './Map';
import { ActionCollection } from './collections/ActionCollection';
import { AisCollection } from './collections/AisCollection';
import { MapsCollection } from './collections/MapsCollection';
import { PlayersCollection } from './collections/PlayersCollection';
import { ItemsCollection } from './collections/ItemsCollection';
import { Server } from './Server';

export class GameEventHandler {
    public static mapsCollection: MapsCollection;
    public static playersCollection: PlayersCollection;
    public static aisCollection: AisCollection;
    public static itemsCollection: ItemsCollection;
    public static actionCollection: ActionCollection;

    constructor() {
        // Init Handlers
        GameEventHandler.mapsCollection = new MapsCollection();
        GameEventHandler.playersCollection = new PlayersCollection();
        GameEventHandler.aisCollection = new AisCollection();
        GameEventHandler.itemsCollection = new ItemsCollection();
        GameEventHandler.actionCollection = new ActionCollection();
    }

    public setEventHandlers() {
        // Socket.IO
        Server.io.on('connection', this.onSocketConnection);
    }

    // New socket connection
    private onSocketConnection(socket: SocketIO.Socket) {
        util.log('New player has connected: ' + socket.id);

        // Listen for client disconnected
        socket.on('disconnect', GameEventHandler.onClientDisconnect);

        // Listen for new character messages
        socket.on('new player', GameEventHandler.onNewPlayer);

        // Listen for move character messages
        socket.on('move player', GameEventHandler.onMoveRequest);

        // Listen for attack character messages
        socket.on('attack character', GameEventHandler.onAttackRequest);

        // Listen for item pickUp messages
        socket.on('pickup item', GameEventHandler.onPickUpRequest);
    }

    // Socket client has disconnected
    private static onClientDisconnect() {
        var socket: SocketIO.Socket = <any>this;

        util.log('Player has disconnected: ' + socket.id);
        var player = GameEventHandler.playersCollection.getPlayerBySocketId(socket.id);

        //TODO understand and fix this bug
        if (!player) {
            console.log('[Critical Error] socket ' + socket.id + ' not found');
            return;
        }

        var playerMapCoord = player.mapPosition;
        var playerGuid = player.guid;

        // Remove character from playersHandler
        GameEventHandler.playersCollection.remove(playerGuid);

        // Broadcast removed player to connected socket clients on the same map
        var playersOnSameMap = GameEventHandler.playersCollection.getAllOnMap(playerMapCoord);
        playersOnSameMap.forEach((player: Player) => {
            Server.io.sockets.connected[player.socketId].emit('remove character', { guid: playerGuid });
        });
    }

    // New player has joined
    private static onNewPlayer(data: any) {
        let socket: SocketIO.Socket = <any>this;

        // Create a new player
        let newPlayer: Player = new Player(socket.id, { x: 7, y: 7 }, { x: 10, y: 10 }, 'knight');

        // Broadcast new player to connected socket clients
        let playersOnSameMap = GameEventHandler.playersCollection.getPlayersOnMapWithIdDifferentFrom({ x: 10, y: 10 }, newPlayer.guid);
        playersOnSameMap.forEach((player: Player) => {
            Server.io.sockets.connected[player.socketId].emit('new character', newPlayer.toMessage());
        });

        // Compute ais on map
        let charactersOnSameMap: Character[] = (<Character[]>playersOnSameMap).concat(<Character[]>GameEventHandler.aisCollection.getAll());
        let charactersOnSameMapJson: any[] = [];
        charactersOnSameMap.forEach((character: Character) => {
            charactersOnSameMapJson.push(character.toMessage());
        });

        // Compute items on map
        let itemsOnSameMap = GameEventHandler.itemsCollection.getAll();
        let itemsOnSameMapJson = _.map(itemsOnSameMap, item => item.toMessage());

        // Send existing characters & existing items & map to the new player
        let map = GameEventHandler.mapsCollection.getMap({ x: 0, y: 0 });
        socket.emit('init player', { player: newPlayer.toMessage(), characters: charactersOnSameMapJson, items: itemsOnSameMapJson, map: map })

        // Add new player to the players array
        GameEventHandler.playersCollection.add(newPlayer);
    }

    // Player has moved
    private static onMoveRequest(msg: { vector: Geo.IPoint }) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var movedPlayer: Player = GameEventHandler.playersCollection.getPlayerBySocketId(socket.id);

        // Player should exist
        if (!movedPlayer) {
            util.log('[Error: "move player"] Player not found sId: ' + socket.id);
            return;
        }

        var newPosition: Geo.IPoint = { x: movedPlayer.gridPosition.x + msg.vector.x, y: movedPlayer.gridPosition.y + msg.vector.y };

        // request move
        movedPlayer.planAction(new Action.Move(newPosition));
    }

    private static onAttackRequest(msg: { guid: string }) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var attackingPlayer: Player = GameEventHandler.playersCollection.getPlayerBySocketId(socket.id);

        // Player should exist
        if (!attackingPlayer) {
            util.log('[Error: "attack player"] Player not found sId: ' + socket.id);
            return;
        }

        if (!msg.guid) {
            util.log('[Error: "attack player"] invalid guid: ' + msg.guid);
            return;
        }

        // request move
        attackingPlayer.planAction(new Action.Attack(msg.guid, attackingPlayer.guid));
    }

    private static onPickUpRequest(msg: { guid: string }) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var pickingUpPlayer: Player = GameEventHandler.playersCollection.getPlayerBySocketId(socket.id);

        // Player should exist
        if (!pickingUpPlayer) {
            util.log('[Error: "pickup object"] Player not found sId: ' + socket.id);
            return;
        }

        if (!msg.guid) {
            util.log('[Error: "pickup object"] invalid guid: ' + msg.guid);
            return;
        }

        // request move
        pickingUpPlayer.planAction(new Action.Pickup(msg.guid));
    }
}
