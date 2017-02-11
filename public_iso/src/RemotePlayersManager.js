define(["require", "exports", 'lodash', "./Player"], function (require, exports, _, Player_1) {
    "use strict";
    var RemotePlayersManager = (function () {
        function RemotePlayersManager() {
            this.remotePlayers = [];
        }
        RemotePlayersManager.prototype.add = function (p) {
            this.remotePlayers.push(p);
        };
        RemotePlayersManager.prototype.addFromJson = function (playerJson) {
            var remotePlayer = new Player_1.Player(playerJson.gridPosition.x, playerJson.gridPosition.y, playerJson.guid, 'pingu');
            this.add(remotePlayer);
        };
        RemotePlayersManager.prototype.addAllFromJson = function (playersJson) {
            _.forEach(playersJson, function (playerJson) {
                this.addFromJson(playerJson);
            }, this);
        };
        RemotePlayersManager.prototype.removeByGuid = function (guid) {
            var removePlayer = this.playerByGuid(guid);
            if (!removePlayer) {
                console.warn("Player not found: " + guid);
                return;
            }
            ;
            removePlayer.destroy();
            this.remotePlayers.splice(this.remotePlayers.indexOf(removePlayer), 1);
        };
        RemotePlayersManager.prototype.removeAll = function () {
            _.forEach(this.remotePlayers, function (remotePlayer) {
                remotePlayer.destroy();
            });
            this.remotePlayers = [];
        };
        RemotePlayersManager.prototype.moveByGuid = function (guid, destPoint) {
            var playerToMove = this.playerByGuid(guid);
            if (!playerToMove) {
                console.warn("Player not found: " + guid);
                return;
            }
            ;
            playerToMove.move(destPoint);
        };
        RemotePlayersManager.prototype.arePresentAt = function (point) {
            for (var i = 0; i < this.remotePlayers.length; i++) {
                if (Phaser.Point.equals(this.remotePlayers[i].gridPosition, point)) {
                    return true;
                }
            }
            return false;
        };
        RemotePlayersManager.prototype.playerByGuid = function (guid) {
            for (var i = 0; i < this.remotePlayers.length; i++) {
                if (this.remotePlayers[i].guid == guid)
                    return this.remotePlayers[i];
            }
            ;
            return null;
        };
        ;
        return RemotePlayersManager;
    }());
    exports.RemotePlayersManager = RemotePlayersManager;
});
//# sourceMappingURL=RemotePlayersManager.js.map