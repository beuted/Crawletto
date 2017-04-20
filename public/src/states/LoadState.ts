export class LoadState
{
    public preload(game: Phaser.Game) {
        console.debug('Entering LoadState');

        //Display Loading screen
        game.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff' });

        game.time.advancedTiming = true;
        game.debug.renderShadow = false;
        game.stage.disableVisibilityChange = true; // Don't stop the game when running in background

        this.preloadAssets(game);
    }

    public create(game: Phaser.Game) {
        game.state.start('Menu');
    }

    public update() {}

    public render() {}

    private preloadAssets(game: Phaser.Game) {
        game.load.json('map.0.0', 'maps/map.0.0.json');
        game.load.atlasJSONHash('tileset', 'assets/tileset-16x16.png', 'assets/tileset-16x16.json');
        game.load.atlasJSONHash('items-tileset', 'assets/items-16x16.png', 'assets/items-16x16.json');
        game.load.spritesheet('zombie', 'assets/zombie.png', 32, 32, 32);
        game.load.spritesheet('monk', 'assets/monk.png', 32, 32, 16);
        game.load.spritesheet('knight', 'assets/knight.png', 32, 32, 16);
    }
}
