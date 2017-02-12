/// <reference path="../../typings/index.d.ts" />

import { GameContext } from "../GameContext";
import { Map } from "../Map";
import { Player } from "../Player";

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
            Map.structureGroup.forEach(function (tile) {
                GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
            }, this);
            GameContext.instance.debug.text(!!GameContext.instance.time.fps ? GameContext.instance.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
            GameContext.instance.debug.cameraInfo(GameContext.instance.camera, 32, 32);
        }
    }

    //TODO: this should be in a class handling current player actions
    private movePlayer(vector: Phaser.Point) {
        console.log('request move player: ' + vector.x + ', ' + vector.y);
        GameContext.player.changeDirection(vector);
        var newPosition = Phaser.Point.add(GameContext.player.gridPosition, vector);
        if (GameContext.map.isCellWalkable(newPosition))
            GameContext.socketManager.requestPlayerMove({ x: vector.x, y: vector.y });
    }

    private fightPlayer() {
        GameContext.player.attack({ x: 0, y: 0 });
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
        spacebarKey.onDown.add(() => this.fightPlayer());

        // press D to enter debugmode
        var dKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(() => GameContext.debugActivated = !GameContext.debugActivated);


    }

    private initMouseInteraction() {
        // Capture click
        //GameContext.instance.input.onUp.add(() => this.movePlayer(GameContext.map.selectedTileGridCoord), this);
    }
}
