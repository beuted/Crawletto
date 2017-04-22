import { Character } from './Character';

export class Gui {
    private lifeBarBgSprite: Phaser.Sprite;
    private lifeBarSprite: Phaser.Sprite;
    private lifeUpdating: boolean = false;

    constructor(game: Phaser.Game) {
        this.initLifeBar(game);
    }

    public update(game: Phaser.Game, player: Character) {
        this.updateLifeBar(game, player);
    }

    private initLifeBar(game: Phaser.Game) {
        let bmd = game.add.bitmapData(300, 15);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, 300, 15);
        bmd.ctx.fillStyle = '#00685e';
        bmd.ctx.fill();

        this.lifeBarBgSprite = game.add.sprite(5, 5, bmd);
        this.lifeBarBgSprite.alpha = 0.5;
        this.lifeBarBgSprite.fixedToCamera = true;

        bmd = game.add.bitmapData(296, 11);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, 296, 11);
        bmd.ctx.fillStyle = '#00f910';
        bmd.ctx.fill();

        this.lifeBarSprite = game.add.sprite(7, 7, bmd);
        this.lifeBarSprite.alpha = 0.5;
        this.lifeBarSprite.fixedToCamera = true;
    }

    private updateLifeBar(game: Phaser.Game, player: Character) {
        if (!player) return;

        var m = player.hp / player.maxHp;
        if (m < 0) m = 0;
        let lifeBarWidth = m * 296;

        if (Math.abs(!this.lifeUpdating && lifeBarWidth - this.lifeBarSprite.width) > 3) {
            this.lifeUpdating = true;
            game.add.tween(this.lifeBarSprite).to( { width: lifeBarWidth }, 200, Phaser.Easing.Linear.None, true)
                .onComplete.addOnce(() => this.lifeUpdating = false);
        }
    }
}