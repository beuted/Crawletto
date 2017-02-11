define(["require", "exports", "./Map", "./RemotePlayersManager", "./SocketManager"], function (require, exports, Map_1, RemotePlayersManager_1, SocketManager_1) {
    "use strict";
    var GameContext = (function () {
        function GameContext() {
        }
        GameContext.create = function () {
            if (!this.socketManager)
                this.socketManager = new SocketManager_1.SocketManager();
            if (!this.map)
                this.map = new Map_1.Map();
            if (!this.remotePlayersManager)
                this.remotePlayersManager = new RemotePlayersManager_1.RemotePlayersManager();
            GameContext.instance.world.resize(2000, 1000);
        };
        GameContext.update = function () {
            this.map.update();
        };
        return GameContext;
    }());
    exports.GameContext = GameContext;
});
//# sourceMappingURL=GameContext.js.map