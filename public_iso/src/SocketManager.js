define(["require", "exports", 'lodash', "./GameContext", "./Player"], function (require, exports, _, GameContext_1, Player_1) {
    "use strict";
    var SocketManager = (function () {
        function SocketManager() {
            this.socket = io();
            this.socket.on("connect", this.onSocketConnected.bind(this));
            this.socket.on("disconnect", this.onSocketDisconnect.bind(this));
            this.socket.on("new player", this.onNewPlayer.bind(this));
            this.socket.on("init player", this.onInitPlayer.bind(this));
            this.socket.on("move player", this.onMovePlayer.bind(this));
            this.socket.on("change map player", this.onChangeMapPlayer.bind(this));
            this.socket.on("remove player", this.onRemovePlayer.bind(this));
        }
        SocketManager.prototype.requestPlayerMove = function (vector) {
            this.socket.emit("move player", { vector: vector });
        };
        SocketManager.prototype.onSocketConnected = function () {
            console.debug("Connected to socket server as " + this.socket.io.engine.id);
            this.socket.emit("new player", {});
        };
        SocketManager.prototype.onSocketDisconnect = function () {
            console.debug("Disconnected from socket server");
        };
        SocketManager.prototype.onNewPlayer = function (data) {
            console.debug("New player on map: " + JSON.stringify(data));
            GameContext_1.GameContext.remotePlayersManager.addFromJson(data);
        };
        SocketManager.prototype.onInitPlayer = function (data) {
            console.debug("Init player: " + JSON.stringify(data));
            GameContext_1.GameContext.player = new Player_1.Player(data.player.gridPosition.x, data.player.gridPosition.y, data.player.guid, _.sample(['cube', 'fairy', 'pingu']), true);
            GameContext_1.GameContext.player = GameContext_1.GameContext.player;
            GameContext_1.GameContext.map.changeMap(data.map);
            _.forEach(data.existingPlayers, function (player) {
                GameContext_1.GameContext.remotePlayersManager.addFromJson(player);
            });
        };
        SocketManager.prototype.onMovePlayer = function (data) {
            if (GameContext_1.GameContext.player.guid === data.guid) {
                GameContext_1.GameContext.player.move(data.position);
                return;
            }
            GameContext_1.GameContext.remotePlayersManager.moveByGuid(data.guid, data.position);
        };
        SocketManager.prototype.onChangeMapPlayer = function (data) {
            if (GameContext_1.GameContext.player.guid === data.guid) {
                console.debug('Player changed map: ' + JSON.stringify(data));
                GameContext_1.GameContext.map.changeMap(data.map);
                GameContext_1.GameContext.player.moveInstant(new Phaser.Point(data.gridPosition.x, data.gridPosition.y));
                GameContext_1.GameContext.remotePlayersManager.removeAll();
                GameContext_1.GameContext.remotePlayersManager.addAllFromJson(data.players);
            }
            else {
                console.error('Player received a "changed map" for another id: ' + JSON.stringify(data));
            }
        };
        SocketManager.prototype.onRemovePlayer = function (data) {
            console.debug("Player removed from map: " + data.guid);
            GameContext_1.GameContext.remotePlayersManager.removeByGuid(data.guid);
        };
        return SocketManager;
    }());
    exports.SocketManager = SocketManager;
});
//# sourceMappingURL=SocketManager.js.map