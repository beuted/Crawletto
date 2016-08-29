/// <reference path="../typings/tsd.d.ts" />

import {GameContext, ICharConfig} from "./GameContext";
import {Map} from "./Map";

export class Player {
    public sprite: any;
    public gridPosition: Phaser.Point;
    public visionRadius: number;
    public id: string;

    private direction: string;
    private charConfig: ICharConfig;

    constructor(startX: number, startY: number, id: string, type: string, current: boolean = false) {
        this.charConfig = GameContext.config.characters[type];
        // setting up the sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'cube', 0, Map.isoGroup); // old cube sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'fairy_anim', 0, Map.sortedGroup);
        this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 36, this.charConfig.sprite, 0, Map.sortedGroup);
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

        // differenciate other players
        if (!current)
            this.sprite.alpha = 0.7;
        else
            GameContext.instance.camera.follow(this.sprite);

        // setting up custom parameters
        this.gridPosition = new Phaser.Point(startX, startY);
        this.visionRadius = this.charConfig.visionRadius;
        this.id = id;
    }

    public move(destPoint: any) {
        this.changeDirection(Phaser.Point.subtract(destPoint, this.gridPosition));
        var animation = `walk-${this.direction}`;

        this.gridPosition.x = destPoint.x;
        this.gridPosition.y = destPoint.y;

        this.sprite.animations.play(animation, this.charConfig.animationFps, true);
        var tween = GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, this.charConfig.animationTime, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(item => this.sprite.animations.stop(animation, true));
    }

    public attack(fightVector: any) {
        this.sprite.animations.play(`fight-${this.direction}`, this.charConfig.animationFps, false);
    }

    public moveInstant(destPoint: Phaser.Point) {
        this.gridPosition = destPoint;
        this.sprite.x = destPoint.x * 32;
        this.sprite.y = destPoint.y * 32;

        // TODO: b.jehanno (hack to move instant because I can't make it work without this T_T )
        GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 1, Phaser.Easing.Linear.None, true);
    }

    public changeDirection(vector: any) {
        if (vector.x < 0) {
            this.direction = 'left';
            this.sprite.frame = this.charConfig.animations.walkLeft[0];
        } else if (vector.x > 0) {
            this.direction = 'right';
            this.sprite.frame = this.charConfig.animations.walkRight[0];
        } else if (vector.y < 0){
            this.direction = 'up';
            this.sprite.frame = this.charConfig.animations.walkUp[0];
        } else {
            this.direction = 'down';
            this.sprite.frame = this.charConfig.animations.walkDown[0];
        }
    }

    public destroy() {
        this.sprite.destroy();
    }
}
