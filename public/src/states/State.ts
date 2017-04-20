export abstract class State
{
    public abstract preload(game: Phaser.Game): void;

    public abstract create(game: Phaser.Game): void;

    public abstract update(game: Phaser.Game): void;

    public abstract render(game: Phaser.Game): void;

    protected createButton(game: Phaser.Game, label: string, x: number, y:number, w: number, h:number, callback: Function) {
        var button1 = game.add.button(x, y, null, callback, this, 2, 1, 0);

        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, label, { font: '30px "Roboto Slab"', fill: '#fff', align: 'center' });
        txt.anchor.setTo(0.5, 0.5);
    }
}
