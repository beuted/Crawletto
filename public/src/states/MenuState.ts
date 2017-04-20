export class MenuState
{
    public preload(game: Phaser.Game) {
        console.debug('Entering MenuState');
    }

    public create(game: Phaser.Game) {
        game.stage.backgroundColor = "#fff";

        this.createButton(game, 'Play', game.world.centerX, game.world.centerY - 60, 300, 100, function(){
            game.state.start('Main');
        });

        this.createButton(game, 'About', game.world.centerX, game.world.centerY + 60, 300, 100, function(){
            game.state.start('About');
        });
    }

    public update(game: Phaser.Game) {}

    public render(game: Phaser.Game) {}

    private createButton(game: Phaser.Game, label: string, x: number, y:number, w: number, h:number, callback: Function) {
        var button1 = game.add.button(x, y, null, callback, this, 2, 1, 0);

        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, label, { font: '30px "Roboto Slab"', fill: '#fff', align: 'center' });
        txt.anchor.setTo(0.5, 0.5);



    }
}
