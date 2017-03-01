/// <reference path="../../typings/index.d.ts" />

import { GameContext } from '../GameContext';
import { Map } from '../Map';
import { Character } from '../Character';

export class MainState {
    public preload() {
        console.debug('Entering MainState');
    }

    public create() {
        // init GameContext (map, keyboard controls, socketManager, remote players, ...TODO)
        GameContext.create();

        this.initKeyboardInteraction();
        this.initMouseInteraction();
    }

    public update() {
        GameContext.update();
    }

    public render() {
        if (GameContext.debugActivated) {
            Map.sortedGroup.forEach(function (tile: Phaser.Sprite) {
                GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
            }, this);
            GameContext.instance.debug.text(!!GameContext.instance.time.fps ? GameContext.instance.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
            GameContext.instance.debug.cameraInfo(GameContext.instance.camera, 32, 32);
        }
    }

    //TODO: this should be in a class handling current player actions
    //TODO: should take a point not a vector (like fightCharacter)
    private movePlayer(vector: Phaser.Point) {
        var newPosition = Phaser.Point.add(GameContext.player.gridPosition, vector);

        // If there is a character on the point, attack him
        if (GameContext.remoteCharactersCollection.getAt(newPosition).length > 0) {
            this.fightCharacter(newPosition);
            return;
        }

        console.log('request move player: ' + vector.x + ', ' + vector.y);
        if (GameContext.map.isCellWalkable(newPosition)) {
            GameContext.socketManager.requestCharacterMove({ x: vector.x, y: vector.y });
        }
    }

    private fightCharacter(point?: Phaser.Point) {
        if (!point)
            point = GameContext.player.getFacingPoint();

        var aimedPlayer = GameContext.remoteCharactersCollection.getAt(point);
        if (!aimedPlayer[0]) { return; }

        GameContext.socketManager.requestCharacterAttack(aimedPlayer[0].guid);
    }

    private initKeyboardInteraction() {
        GameContext.instance.input.keyboard.addKeyCapture([
            Phaser.Keyboard.D,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        var leftKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(() => this.movePlayer(new Phaser.Point(-1, 0)));

        var rightKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(() => this.movePlayer(new Phaser.Point(1, 0)));

        var upKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(() => this.movePlayer(new Phaser.Point(0, -1)));

        var downKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(() => this.movePlayer(new Phaser.Point(0, 1)));

        var spacebarKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebarKey.onDown.add(() => this.fightCharacter());

        // press D to enter debugmode
        var dKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(() => GameContext.debugActivated = !GameContext.debugActivated);
    }

    private initMouseInteraction() {
        // Capture click
        //GameContext.instance.input.onUp.add(() => this.movePlayer(GameContext.map.selectedTileGridCoord), this);
    }
}
