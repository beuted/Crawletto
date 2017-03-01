import { GameContext, ICharConfig } from './GameContext';
import { Map } from './Map';
import { Element } from './Element';

export class Character extends Element {
    public visionRadius: number;
    public hp: number;
    public maxHp: number;

    private direction: string = 'right';
    private charConfig: ICharConfig;

    constructor(gridPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, guid: string, hp: number, type: string, current: boolean = false) {
        super(gridPosition, mapPosition, guid, type);
        this.charConfig = GameContext.config.characters[type];

        this.visionRadius = this.charConfig.visionRadius;
        this.hp = hp;
        this.maxHp = this.charConfig.maxHp;

        // setting up the sprite
        this.sprite = GameContext.instance.add.sprite(gridPosition.x * 32, gridPosition.y * 32, this.charConfig.sprite, 0, Map.sortedGroup);
        this.sprite.anchor.set(0.25, 0.5);
        this.sprite.scale.set(2);
        this.sprite.smoothed = false;
        this.sprite.animations.add('walk-down', this.charConfig.animations.walkDown);
        this.sprite.animations.add('walk-up', this.charConfig.animations.walkUp);
        this.sprite.animations.add('walk-right', this.charConfig.animations.walkRight);
        this.sprite.animations.add('walk-left', this.charConfig.animations.walkLeft);
        this.sprite.animations.add('fight-down', this.charConfig.animations.fightDown);
        this.sprite.animations.add('fight-up', this.charConfig.animations.fightUp);
        this.sprite.animations.add('fight-right', this.charConfig.animations.fightRight);
        this.sprite.animations.add('fight-left', this.charConfig.animations.fightLeft);

        // differenciate other characters
        if (!current)
            this.sprite.alpha = 0.7;
        else
            GameContext.instance.camera.follow(this.sprite);

        // setting up custom parameters
        this.visionRadius = this.charConfig.visionRadius;
        this.hp = hp;        
        this.maxHp = this.charConfig.maxHp;
    }

    public move(destPoint: any) {
        this.changeDirection(Phaser.Point.subtract(destPoint, this.gridPosition));
        var animation = `walk-${this.direction}`;

        this.gridPosition.x = destPoint.x;
        this.gridPosition.y = destPoint.y;

        this.sprite.animations.play(animation, this.charConfig.animationFps, true);
        var tween = GameContext.instance.add.tween(this.sprite).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, this.charConfig.animationTime, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(() => this.sprite.animations.stop(animation, true));
    }

    public attack() {
        this.sprite.animations.play(`fight-${this.direction}`, this.charConfig.animationFps, false);
    }

    public moveInstant(destPoint: Phaser.Point) {
        this.gridPosition = destPoint;
        this.sprite.x = destPoint.x * 32;
        this.sprite.y = destPoint.y * 32;

        // TODO: b.jehanno (hack to move instant because I can't make it work without this T_T )
        //GameContext.instance.add.tween(this.sprite).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 1, Phaser.Easing.Linear.None, true);
    }

    public changeDirection(vector: any) {
        if (vector.x < 0) {
            this.direction = 'left';
            this.sprite.frame = this.charConfig.animations.walkLeft[0];
        } else if (vector.x > 0) {
            this.direction = 'right';
            this.sprite.frame = this.charConfig.animations.walkRight[0];
        } else if (vector.y < 0) {
            this.direction = 'up';
            this.sprite.frame = this.charConfig.animations.walkUp[0];
        } else {
            this.direction = 'down';
            this.sprite.frame = this.charConfig.animations.walkDown[0];
        }
    }

    public getFacingPoint(): Phaser.Point {
        switch(this.direction) {
            case 'left': {
                return this.gridPosition.clone().add(-1, 0);
            }
            case 'right': {
                return this.gridPosition.clone().add(1, 0);
            }
            case 'up': {
                return this.gridPosition.clone().add(0, -1);
            }
            case 'down': {
                return this.gridPosition.clone().add(0, 1);
            }
            default:
                throw new Error('Character.getFacingPoint(): Unknown direction');
        }
    }

    public getDirectionVector(): Phaser.Point {
        switch(this.direction) {
            case 'left': {
                return new Phaser.Point(-1, 0);
            }
            case 'right': {
                return new Phaser.Point(1, 0);
            }
            case 'up': {
                return new Phaser.Point(0, -1);
            }
            case 'down': {
                return new Phaser.Point(0, 1);
            }
            default:
                throw new Error('Character.getDirectionVector(): Unknown direction');
        }
    }
}
