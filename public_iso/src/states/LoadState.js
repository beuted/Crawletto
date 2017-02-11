define(["require", "exports", "../GameContext"], function (require, exports, GameContext_1) {
    "use strict";
    var LoadState = (function () {
        function LoadState() {
        }
        LoadState.prototype.preload = function () {
            console.debug('Entering LoadState');
            GameContext_1.GameContext.instance.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff' });
            GameContext_1.GameContext.instance.time.advancedTiming = true;
            GameContext_1.GameContext.instance.debug.renderShadow = false;
            GameContext_1.GameContext.instance.stage.disableVisibilityChange = true;
            this.preloadAssets();
        };
        LoadState.prototype.create = function () {
            GameContext_1.GameContext.instance.state.start('Main');
        };
        LoadState.prototype.update = function () { };
        LoadState.prototype.render = function () { };
        LoadState.prototype.preloadAssets = function () {
            GameContext_1.GameContext.instance.load.json('map.0.0', 'maps/map.0.0.json');
            GameContext_1.GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset-test.png', 'assets/tileset-mod.json');
            GameContext_1.GameContext.instance.load.image('cube', 'assets/cube.png');
            GameContext_1.GameContext.instance.load.spritesheet('fairy_anim', 'assets/fairy.png', 96, 96, 16);
            GameContext_1.GameContext.instance.load.spritesheet('pingu_anim', 'assets/pingu.png', 82, 84, 64);
            GameContext_1.GameContext.instance.load.spritesheet('cube_anim', 'assets/cube.png', 82, 78, 10);
        };
        return LoadState;
    }());
    exports.LoadState = LoadState;
});
//# sourceMappingURL=LoadState.js.map