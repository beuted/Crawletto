define(["require", "exports", "./src/GameContext", "./src/states/BootState", "./src/states/LoadState", "./src/states/MainState"], function (require, exports, GameContext_1, BootState_1, LoadState_1, MainState_1) {
    "use strict";
    var Game = (function () {
        function Game(conf) {
            GameContext_1.GameContext.instance = new Phaser.Game(1000, 500, Phaser.CANVAS, 'gameCanvas', null, true, false);
            GameContext_1.GameContext.debugActivated = false;
            GameContext_1.GameContext.config = conf;
            GameContext_1.GameContext.instance.state.add('Boot', new BootState_1.BootState());
            GameContext_1.GameContext.instance.state.add('Load', new LoadState_1.LoadState());
            GameContext_1.GameContext.instance.state.add('Main', new MainState_1.MainState());
            GameContext_1.GameContext.instance.state.start('Boot');
        }
        return Game;
    }());
    exports.Game = Game;
});
//# sourceMappingURL=Game.js.map