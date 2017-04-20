export class AboutState
{
    public preload(game: Phaser.Game) {
        console.debug('Entering MenuState');
    }

    public create(game: Phaser.Game) {
        game.add.text(80, 150, `This game was made in my spare time with Phaser in typescript for both UI and Backend.
        The inspirations for it are nethack, Don\'t starve, Fallout,
        and probably a lot more that I'm not aware of, I hope you'll enjoy it :)
        More about me at benoit.jehanno.net`, { font: '20px "Roboto Slab"', fill: '#fff', align: 'center' });

        this.createButton(game, 'Back', game.world.centerX, game.world.centerY + 80, 300, 100, function(){
            game.state.start('Menu');
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
