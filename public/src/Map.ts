import * as _ from 'lodash';
import { GameContext } from './GameContext';
import { LightSource } from './ShadowCasting';

export enum TileType {
    Water = 0,
    Sand = 1,
    Grass = 2,
    Stone = 3,
    Wood = 4,
    Watersand = 5,
    Grasssand = 6,
    Sandstone = 7,
    Bush1 = 8,
    Bush2 = 9,
    Mushroom = 10,
    Wall = 11,
    Window = 12,
    Wallangle = 13
}

interface Plateau {
    floors: number[][];
    structures: number[][];
    coord: { x: number, y: number };
}

class Cell {
    public floorId: number;
    public structureId: number;
    public floorTile: Phaser.Sprite;
    public structureTile: Phaser.Sprite;

    constructor(floorId: number, structureId: number, floorTile: Phaser.Sprite, structureTile: Phaser.Sprite) {
        this.floorId = floorId;
        this.structureId = structureId;
        this.floorTile = floorTile;
        this.structureTile = structureTile;
    }

    public color(color: number) {
        if (this.floorTile) this.floorTile.tint = color;
        if (this.structureTile) this.structureTile.tint = color;
    }

    public destroy() {
        if (this.floorTile) this.floorTile.destroy();
        if (this.structureTile) this.structureTile.destroy();
    }

    public isWalkable(walkables: number[]): boolean {
        return _.includes(walkables, this.floorId) && !this.structureId;
    }

    public isOpaque(opaques: number[]): boolean {
        if (_.includes(opaques, this.structureId)) {
            return true;
        }
        return false;
    }
}

export class Map {
    // TODO: should be private once character will be handle by the Map
    public static floorGroup: Phaser.Group;
    public static itemGroup: Phaser.Group;
    public static sortedGroup: Phaser.Group;

    public position: Phaser.Point;

    private static tileSize = 32;
    private static size: { x: number, y: number };
    private static walkables: number[];
    private static opaques: number[];

    private plateau: Plateau;
    private cells: Cell[][];
    private tileArray: string[];

    private lightSource: LightSource;

    constructor() {
        this.position = new Phaser.Point(0, 0);

        Map.size = GameContext.config.map.size;
        Map.walkables = GameContext.config.map.walkables;
        Map.opaques = GameContext.config.map.opaques;

        // init tileArray
        this.tileArray = [];
        this.tileArray[TileType.Water] = 'water';
        this.tileArray[TileType.Sand] = 'sand';
        this.tileArray[TileType.Grass] = 'grass';
        this.tileArray[TileType.Stone] = 'stone';
        this.tileArray[TileType.Wood] = 'wood';
        this.tileArray[TileType.Watersand] = 'watersand';
        this.tileArray[TileType.Grasssand] = 'grasssand';
        this.tileArray[TileType.Sandstone] = 'sandstone';
        this.tileArray[TileType.Bush1] = 'bush1';
        this.tileArray[TileType.Bush2] = 'bush2';
        this.tileArray[TileType.Mushroom] = 'mushroom';
        this.tileArray[TileType.Wall] = 'wall';
        this.tileArray[TileType.Window] = 'window';
        this.tileArray[TileType.Wallangle] = 'wallangle';

        // init isoGroup
        Map.floorGroup = GameContext.instance.add.group();
        Map.itemGroup = GameContext.instance.add.group();
        Map.sortedGroup = GameContext.instance.add.group();

        Map.floorGroup.enableBody = true;
        Map.itemGroup.enableBody = true;
        Map.sortedGroup.enableBody = true;

        // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen

        // init path finding
        this.lightSource = new LightSource(this);

        this.initPlateau();
    }

    public get plateauSize() { return new Phaser.Point(Map.size.x, Map.size.y) }

    public getPlateauFloor(point: Phaser.Point): number {
        var line = this.plateau.floors[point.y];
        if (line === undefined || line[point.x] === undefined) {
            console.log('[WARNING: Map>getPlateauFloor] Tried to access (' + point.x + ', ' + point.y + ') but it is undefined');
            return 0;
        }
        return line[point.x];
    }

    public getPlateauStructure(point: Phaser.Point): number {
        return this.plateau.structures[point.y][point.x];
    }

    public isCellWalkable(point: Phaser.Point) {
        // collision handling
        var cell = this.getCell(point);
        if (!cell || !cell.isWalkable(Map.walkables))
            return false;

        return true;
    }

    public isCellOpaque(point: Phaser.Point) {
        var cell = this.getCell(point);
        if (!cell || cell.isOpaque(Map.opaques))
            return true;

        return false;
    }

    public update() {
        if (!this.plateau) //TODO: find a better solution
            return;

        // set to dark every tile by default
        this.ForEachCells(cell => cell.color(0x888888));

        if (GameContext.player) {
            this.lightSource.update(GameContext.player.gridPosition, GameContext.player.visionRadius).forEach((position) => this.getCell(position).color(0xffffff));
        }

        Map.sortedGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }

    public getCell(point: Phaser.Point) {
        return this.cells[point.x][point.y];
    }

    public ForEachCells(f: (cell: Cell) => void) {
        this.cells.forEach((cells, i) => {
            cells.forEach((cell, i) => {
                f(cell);
            });
        });
    }

    public initPlateau() {
        if (!this.plateau) //TODO: find a better solution
            return;

        // remove old tiles
        if (this.cells)
            this.ForEachCells(cell => cell.destroy());

        // init water & plateauTiles
        var point: Phaser.Point = new Phaser.Point(0, 0);
        this.cells = [];
        for (point.x = 0; point.x < Map.size.x; point.x++) {
            this.cells[point.x] = [];
            for (point.y = 0; point.y < Map.size.y; point.y++) {
                this.cells[point.x][point.y] = new Cell(null, null, null, null);
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                var structureId = this.getPlateauStructure(point);
                var floorId = this.getPlateauFloor(point);

                var floorTile = GameContext.instance.add.sprite(point.x * Map.tileSize, point.y * Map.tileSize, 'tileset', this.tileArray[floorId], Map.floorGroup);
                floorTile.anchor.set(0, 0);
                floorTile.scale.set(2);
                floorTile.smoothed = false;
                floorTile.body.moves = false;
                this.cells[point.x][point.y].floorId = floorId;
                this.cells[point.x][point.y].floorTile = floorTile;

                if (structureId != 0) {
                    var structureTile = GameContext.instance.add.sprite(point.x * Map.tileSize, point.y * Map.tileSize, 'tileset', this.tileArray[structureId], Map.sortedGroup);
                    structureTile.anchor.set(0, 0.5);
                    structureTile.scale.set(2);
                    structureTile.smoothed = false;
                    structureTile.body.moves = false;
                    this.cells[point.x][point.y].structureId = structureId;
                    this.cells[point.x][point.y].structureTile = structureTile;
                }
            }
        }
    }

    public changeMap(mapData: any) {
        this.position = mapData.position;
        this.plateau = mapData;
        this.initPlateau();
    }
}
