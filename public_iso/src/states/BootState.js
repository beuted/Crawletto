define(["require", "exports", "../GameContext"], function (require, exports, GameContext_1) {
    "use strict";
    var BootState = (function () {
        function BootState() {
        }
        BootState.prototype.preload = function () {
            console.debug('Entering BootState');
        };
        BootState.prototype.create = function () {
            GameContext_1.GameContext.instance.plugins.add(Phaser.Plugin.Isometric, GameContext_1.GameContext.instance);
            GameContext_1.GameContext.instance.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
            GameContext_1.GameContext.instance.iso.anchor.setTo(0.5, 0.1);
            GameContext_1.GameContext.instance.state.start('Load');
        };
        BootState.prototype.update = function () { };
        BootState.prototype.render = function () { };
        return BootState;
    }());
    exports.BootState = BootState;
});
//# sourceMappingURL=BootState.js.map