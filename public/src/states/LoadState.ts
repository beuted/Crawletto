import {GameContext} from '../GameContext';

export class LoadState
{
    public preload() {
        console.debug('Entering LoadState');

        //Display Loading screen
        GameContext.instance.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff' });

        GameContext.instance.time.advancedTiming = true;
        GameContext.instance.debug.renderShadow = false;
        GameContext.instance.stage.disableVisibilityChange = true; // Don't stop the game when running in background

        this.preloadAssets();
    }

    public create() {
        GameContext.instance.state.start('Main');
    }

    public update() {}

    public render() {}

    private preloadAssets() {
        GameContext.instance.load.json('map.0.0', 'maps/map.0.0.json');
        GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset-16x16.png', 'assets/tileset-16x16.json');
        GameContext.instance.load.atlasJSONHash('items-tileset', 'assets/items-16x16.png', 'assets/items-16x16.json');
        GameContext.instance.load.spritesheet('zombie', 'assets/zombie.png', 32, 32, 32);
        GameContext.instance.load.spritesheet('monk', 'assets/monk.png', 32, 32, 16);
        GameContext.instance.load.spritesheet('knight', 'assets/knight.png', 32, 32, 16);
    }
}
