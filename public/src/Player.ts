/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Map} from "./Map";

export class Player {
    public sprite: any;
    public gridPosition: Phaser.Point;
    public visionRadius: number;
    public id: string;

    private direction: string;

    constructor(startX: number, startY: number, id: string, current: boolean = false) {
        // setting up the sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'cube', 0, Map.isoGroup); // old cube sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'fairy_anim', 0, Map.sortedGroup);
        this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 36, 'pingu_anim', 0, Map.sortedGroup);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0.5);
        this.sprite.smoothed = false;
        this.sprite.animations.add('walk-down', [56,57,58,59]);
        this.sprite.animations.add('walk-up', [24,25,26,27]);
        this.sprite.animations.add('walk-right', [8,9,10,11]);
        this.sprite.animations.add('walk-left', [40,41,42,43]);
        this.sprite.animations.add('fight-down', [60,61,62,64,56]);
        this.sprite.animations.add('fight-up', [28,29,30,31,24]);
        this.sprite.animations.add('fight-right', [12,13,14,15,8]);
        this.sprite.animations.add('fight-left', [44,45,46,47,40]);

        // differenciate other players
        if (!current)
            this.sprite.alpha = 0.7;
        else
            GameContext.instance.camera.follow(this.sprite);

        // setting up custom parameters
        this.gridPosition = new Phaser.Point(startX, startY);
        this.visionRadius = 7;
        this.id = id;
    }

    public move(destPoint: any) {
        this.changeDirection(Phaser.Point.subtract(destPoint, this.gridPosition));
        var animation = `walk-${this.direction}`;

        this.gridPosition.x = destPoint.x;
        this.gridPosition.y = destPoint.y;

        this.sprite.animations.play(animation, 16, true);
        var tween = GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 250, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(item => this.sprite.animations.stop(animation, true));
    }

    public attack(fightVector: any) {
        this.sprite.animations.play(`fight-${this.direction}`, 16, false);
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
            this.sprite.frame = 40;
        } else if (vector.x > 0) {
            this.direction = 'right';
            this.sprite.frame = 8;
        } else if (vector.y < 0){
            this.direction = 'up';
            this.sprite.frame = 24;
        } else {
            this.direction = 'down';
            this.sprite.frame = 56;
        }
    }

    public destroy() {
        this.sprite.destroy();
    }
}
