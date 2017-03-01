/// <reference path="typings/index.d.ts" />
import { GameContext } from './src/GameContext';
import { BootState } from './src/states/BootState';
import { LoadState } from './src/states/LoadState';
import { MainState } from './src/states/MainState';

export class Game {
    constructor(conf: any) {
        // using canvas here just because it runs faster for the body debug stuff
        GameContext.instance = new Phaser.Game(992, 512, Phaser.CANVAS, 'gameCanvas', null, true, false);
        GameContext.debugActivated = false;
        GameContext.config = conf;

        GameContext.instance.state.add('Boot', new BootState());
        GameContext.instance.state.add('Load', new LoadState());
        GameContext.instance.state.add('Main', new MainState());

        GameContext.instance.state.start('Boot');
    }
}
