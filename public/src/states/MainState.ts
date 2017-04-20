import { GameContext } from '../GameContext';
import { Map } from '../Map';
import { Character } from '../Character';

export class MainState {
    public preload(game: Phaser.Game) {
        console.debug('Entering MainState');
    }

    public create(game: Phaser.Game) {
        // init GameContext (map, keyboard controls, socketManager, remote players, ...TODO)
        GameContext.create();

        this.initKeyboardInteraction(game);
        this.initMouseInteraction();
    }

    public update(game: Phaser.Game) {
        GameContext.update();
    }

    public render(game: Phaser.Game) {
        if (GameContext.debugActivated) {
            Map.sortedGroup.forEach((tile: Phaser.Sprite) => {
                game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);

            }, this);
            game.debug.text(!!game.time.fps ? game.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
            game.debug.cameraInfo(game.camera, 32, 32);
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

    private pickUpObject() {
        let point = GameContext.player.gridPosition;
        let items = GameContext.remoteItemsCollection.getAt(point);
        if (!items[0]) { return; }

        GameContext.socketManager.requestCharacterPickup(items[0].guid);
    }

    private initKeyboardInteraction(game: Phaser.Game) {
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.D,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.COMMA
        ]);

        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(() => this.movePlayer(new Phaser.Point(-1, 0)));

        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(() => this.movePlayer(new Phaser.Point(1, 0)));

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(() => this.movePlayer(new Phaser.Point(0, -1)));

        var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(() => this.movePlayer(new Phaser.Point(0, 1)));

        // Press "spacebar" to attack in front of you
        var spacebarKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebarKey.onDown.add(() => this.fightCharacter());

        // press "," to pick up an object
        var spacebarKey = game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
        spacebarKey.onDown.add(() => this.pickUpObject());

        // press "D" to enter debugmode
        var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(() => GameContext.debugActivated = !GameContext.debugActivated);
    }

    private initMouseInteraction() {
        // Capture click
        //game.input.onUp.add(() => this.movePlayer(GameContext.map.selectedTileGridCoord), this);
    }
}
