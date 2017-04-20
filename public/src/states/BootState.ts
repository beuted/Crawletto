import { GameContext } from "../GameContext";

export class BootState {
    public preload(game: Phaser.Game) {
        console.debug('Entering BootState');
    }

    public create(game: Phaser.Game) {
        //game.plugins.add(Phaser.Plugin.Isometric, game);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.iso.anchor.setTo(0.5, 0.1);

        game.state.start('Load');
    }

    public update(game: Phaser.Game) { }

    public render(game: Phaser.Game) { }
}
