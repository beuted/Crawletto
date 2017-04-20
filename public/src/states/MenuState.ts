import { State } from './State';

export class MenuState extends State
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
}
