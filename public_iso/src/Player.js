define(["require", "exports", "./GameContext", "./Map"], function (require, exports, GameContext_1, Map_1) {
    "use strict";
    var Player = (function () {
        function Player(startX, startY, guid, type, current) {
            if (current === void 0) { current = false; }
            this.charConfig = GameContext_1.GameContext.config.characters[type];
            this.sprite = GameContext_1.GameContext.instance.add.isoSprite(startX * 32, startY * 32, 36, this.charConfig.sprite, 0, Map_1.Map.sortedGroup);
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.scale.set(0.5);
            this.sprite.smoothed = false;
            this.sprite.animations.add('walk-down', this.charConfig.animations.walkDown);
            this.sprite.animations.add('walk-up', this.charConfig.animations.walkUp);
            this.sprite.animations.add('walk-right', this.charConfig.animations.walkRight);
            this.sprite.animations.add('walk-left', this.charConfig.animations.walkLeft);
            this.sprite.animations.add('fight-down', this.charConfig.animations.fightDown);
            this.sprite.animations.add('fight-up', this.charConfig.animations.fightUp);
            this.sprite.animations.add('fight-right', this.charConfig.animations.fightRight);
            this.sprite.animations.add('fight-left', this.charConfig.animations.fightLeft);
            if (!current)
                this.sprite.alpha = 0.7;
            else
                GameContext_1.GameContext.instance.camera.follow(this.sprite);
            this.gridPosition = new Phaser.Point(startX, startY);
            this.visionRadius = this.charConfig.visionRadius;
            this.guid = guid;
            this.maxLife = this.charConfig.maxLife;
            this.life = this.charConfig.maxLife;
        }
        Player.prototype.move = function (destPoint) {
            var _this = this;
            this.changeDirection(Phaser.Point.subtract(destPoint, this.gridPosition));
            var animation = "walk-" + this.direction;
            this.gridPosition.x = destPoint.x;
            this.gridPosition.y = destPoint.y;
            this.sprite.animations.play(animation, this.charConfig.animationFps, true);
            var tween = GameContext_1.GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, this.charConfig.animationTime, Phaser.Easing.Linear.None, true);
            tween.onComplete.addOnce(function (item) { return _this.sprite.animations.stop(animation, true); });
        };
        Player.prototype.attack = function (fightVector) {
            this.sprite.animations.play("fight-" + this.direction, this.charConfig.animationFps, false);
        };
        Player.prototype.moveInstant = function (destPoint) {
            this.gridPosition = destPoint;
            this.sprite.x = destPoint.x * 32;
            this.sprite.y = destPoint.y * 32;
            GameContext_1.GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 1, Phaser.Easing.Linear.None, true);
        };
        Player.prototype.changeDirection = function (vector) {
            if (vector.x < 0) {
                this.direction = 'left';
                this.sprite.frame = this.charConfig.animations.walkLeft[0];
            }
            else if (vector.x > 0) {
                this.direction = 'right';
                this.sprite.frame = this.charConfig.animations.walkRight[0];
            }
            else if (vector.y < 0) {
                this.direction = 'up';
                this.sprite.frame = this.charConfig.animations.walkUp[0];
            }
            else {
                this.direction = 'down';
                this.sprite.frame = this.charConfig.animations.walkDown[0];
            }
        };
        Player.prototype.destroy = function () {
            this.sprite.destroy();
        };
        return Player;
    }());
    exports.Player = Player;
});
//# sourceMappingURL=Player.js.map