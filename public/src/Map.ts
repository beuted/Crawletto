/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {LightSource} from "./ShadowCasting";

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
    size: { x: number, y: number };
    walkables: number[];
    opaques: number[];
}

class Cell {
    public floorId: number;
    public structureId: number;
    public floorTile: Phaser.Plugin.Isometric.IsoSprite;
    public structureTile: Phaser.Plugin.Isometric.IsoSprite;


    constructor(floorId: number, structureId: number, floorTile : Phaser.Plugin.Isometric.IsoSprite, structureTile: Phaser.Plugin.Isometric.IsoSprite) {
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

    public isWalkable(walkables): boolean {
        return _.includes(walkables, this.floorId) && !this.structureId;
    }

    public isOpaque(opaques): boolean {
        if (_.includes(opaques, this.structureId)) {
            return true;
        }
        return false;
    }
}

export class Map {
    // TODO: should be private once character will be handle by the Map
    public static isoGroup: Phaser.Group;
    public static sortedGroup: Phaser.Group;
    public coord: Phaser.Point;

    private static tileSize = 32;

    private plateau: Plateau;
    private cells: Cell[][];
    private tileArray: string[];
    private water: Phaser.Plugin.Isometric.IsoSprite[];

    private easystar: EasyStar.js;
    private lightSource: LightSource;

    constructor() {
        this.coord = new Phaser.Point(0, 0);

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
        Map.isoGroup = GameContext.instance.add.group();
        Map.sortedGroup = GameContext.instance.add.group();

        Map.isoGroup.enableBody = true;
        Map.sortedGroup.enableBody = true;
        // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
        Map.sortedGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

        // init path finding
        this.easystar = new EasyStar.js();
        this.lightSource = new LightSource(this);

        this.initPlateau();
    }

    public get plateauSize() { return new Phaser.Point(this.plateau.size.x, this.plateau.size.y) }

    public getPlateauFloor(point: Phaser.Point): number {
        var line = this.plateau.floors[point.y];
        if (line === undefined || line[point.x] === undefined) {
            console.log("[WARNING: Map>getPlateauFloor] Tried to access (" + point.x + ", " + point.y + ") but it is undefined");
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
        if (!cell || !cell.isWalkable(this.plateau.walkables))
            return false;

        return true;
    }

    public isCellOpaque(point: Phaser.Point) {
        var cell = this.getCell(point);
        if (!cell || cell.isOpaque(this.plateau.opaques))
            return true;

        return false;
    }

/*    public findPath(fromPoint: Phaser.Point, toPoint: Phaser.Point): Q.Promise<any[]> {
        var deferred: Q.Deferred<any[]> = Q.defer<any[]>();
        this.easystar.findPath(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, function(path: any[]) {
            if (path === null) {
                deferred.reject("Path returned by easystar is null");
                return;
            }

            if (path.length <= 1) {
                deferred.reject("Path returned by easystar has size of 0 or 1");
                return;
            }

            path.shift(); // remove the first element which is not a move
            deferred.resolve(path);
        });
        this.easystar.calculate();

        return deferred.promise;
    }*/

    public update() {
        if (!this.plateau) //TODO: find a better solution
            return;

        // make the water move nicely
        this.water.forEach(w => {
            w.isoZ = (-2 * Math.sin((GameContext.instance.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((GameContext.instance.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // set to dark every tile by default
        this.ForEachCells(cell => cell.color(0x888888));

        if (GameContext.player) {
            this.lightSource.update(GameContext.player.gridPosition, GameContext.player.visionRadius).forEach((position) => this.getCell(position).color(0xffffff));
        }
        // tile selection animation
        // > Update the cursor position. (TODO: this shouldn't be done in Map)
        var cursorPos: Phaser.Plugin.Isometric.Point3 = GameContext.instance.iso.unproject(GameContext.instance.input.activePointer.position);
        var selectedCell: Cell;
        this.ForEachCells(cell => {
            // Tile selection -- Note: those "1.5" are fucking mysterious to me :/
            var inBounds = (<any>cell.floorTile.isoBounds).containsXY(cursorPos.x + Map.tileSize * 1.5, cursorPos.y + Map.tileSize * 1.5);
            if (inBounds) {
                selectedCell = cell;
                cell.color(0x86bfda);
            }
        });

        if (selectedCell && GameContext.instance.input.activePointer.isDown) {
            selectedCell.color(0xff00ff);
        }

        // simple sort for the isometric tiles
        GameContext.instance.iso.topologicalSort(Map.sortedGroup);
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
        this.water = [];

        // init pathfinding
        //this.easystar.setGrid(this.plateau.tiles);
        //this.easystar.setAcceptableTiles(this.plateau.walkables);

        var point: Phaser.Point = new Phaser.Point(0, 0);
        this.cells = [];
        for (point.x = 0; point.x < this.plateau.size.x; point.x++) {
            this.cells[point.x] = [];
            for (point.y = 0; point.y < this.plateau.size.y; point.y++) {
                this.cells[point.x][point.y] = new Cell(null, null, null, null);
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                var structureId = this.getPlateauStructure(point);
                var floorId = this.getPlateauFloor(point);

                if (structureId != 0) {
                    var structureTile = GameContext.instance.add.isoSprite(point.x * Map.tileSize, point.y * Map.tileSize, 0, 'tileset', this.tileArray[structureId], Map.sortedGroup);
                    structureTile.anchor.set(0.5, 1);
                    structureTile.smoothed = true;
                    structureTile.body.moves = false;
                    this.cells[point.x][point.y].structureId = structureId;
                    this.cells[point.x][point.y].structureTile = structureTile;
                }

                var floorTile = GameContext.instance.add.isoSprite(point.x * Map.tileSize, point.y * Map.tileSize, 0, 'tileset', this.tileArray[floorId], Map.isoGroup);
                floorTile.anchor.set(0.5, 1);
                floorTile.smoothed = true;
                floorTile.body.moves = false;
                this.cells[point.x][point.y].floorId = floorId;
                this.cells[point.x][point.y].floorTile = floorTile;

                if (floorId === 0) {
                    this.water.push(floorTile);
                }
            }
        }

        // topological sort for the isometric tiles
        GameContext.instance.iso.topologicalSort(Map.sortedGroup);
    }

    public changeMap(mapData: any) {
        this.coord = mapData.coord;
        this.plateau = mapData;
        this.initPlateau();
    }
}
