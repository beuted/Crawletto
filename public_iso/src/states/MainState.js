define(["require", "exports", "../GameContext", "../Map"], function (require, exports, GameContext_1, Map_1) {
    "use strict";
    var MainState = (function () {
        function MainState() {
        }
        MainState.prototype.preload = function () {
            console.debug('Entering MainState');
        };
        MainState.prototype.create = function () {
            GameContext_1.GameContext.create();
            this.initKeyboardInteraction();
            this.initMouseInteraction();
        };
        MainState.prototype.update = function () {
            GameContext_1.GameContext.update();
        };
        MainState.prototype.render = function () {
            if (GameContext_1.GameContext.debugActivated) {
                Map_1.Map.sortedGroup.forEach(function (tile) {
                    GameContext_1.GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
                }, this);
                GameContext_1.GameContext.instance.debug.text(!!GameContext_1.GameContext.instance.time.fps ? GameContext_1.GameContext.instance.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
                GameContext_1.GameContext.instance.debug.cameraInfo(GameContext_1.GameContext.instance.camera, 32, 32);
            }
        };
        MainState.prototype.movePlayer = function (vector) {
            console.log("request move player: " + vector.x + ", " + vector.y);
            GameContext_1.GameContext.player.changeDirection(vector);
            var newPosition = Phaser.Point.add(GameContext_1.GameContext.player.gridPosition, vector);
            if (GameContext_1.GameContext.map.isCellWalkable(newPosition))
                GameContext_1.GameContext.socketManager.requestPlayerMove({ x: vector.x, y: vector.y });
        };
        MainState.prototype.fightPlayer = function () {
            GameContext_1.GameContext.player.attack({ x: 0, y: 0 });
        };
        MainState.prototype.initKeyboardInteraction = function () {
            var _this = this;
            GameContext_1.GameContext.instance.input.keyboard.addKeyCapture([
                Phaser.Keyboard.D,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.SPACEBAR
            ]);
            var leftKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            leftKey.onDown.add(function () { return _this.movePlayer(new Phaser.Point(-1, 0)); });
            var rightKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            rightKey.onDown.add(function () { return _this.movePlayer(new Phaser.Point(1, 0)); });
            var upKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.UP);
            upKey.onDown.add(function () { return _this.movePlayer(new Phaser.Point(0, -1)); });
            var downKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            downKey.onDown.add(function () { return _this.movePlayer(new Phaser.Point(0, 1)); });
            var spacebarKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spacebarKey.onDown.add(function () { return _this.fightPlayer(); });
            var dKey = GameContext_1.GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.D);
            dKey.onDown.add(function () { return GameContext_1.GameContext.debugActivated = !GameContext_1.GameContext.debugActivated; });
        };
        MainState.prototype.initMouseInteraction = function () {
        };
        return MainState;
    }());
    exports.MainState = MainState;
});
//# sourceMappingURL=MainState.js.map