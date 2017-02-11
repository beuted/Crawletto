define(["require", "exports", 'lodash', './GameContext', './ShadowCasting'], function (require, exports, _, GameContext_1, ShadowCasting_1) {
    "use strict";
    (function (TileType) {
        TileType[TileType["Water"] = 0] = "Water";
        TileType[TileType["Sand"] = 1] = "Sand";
        TileType[TileType["Grass"] = 2] = "Grass";
        TileType[TileType["Stone"] = 3] = "Stone";
        TileType[TileType["Wood"] = 4] = "Wood";
        TileType[TileType["Watersand"] = 5] = "Watersand";
        TileType[TileType["Grasssand"] = 6] = "Grasssand";
        TileType[TileType["Sandstone"] = 7] = "Sandstone";
        TileType[TileType["Bush1"] = 8] = "Bush1";
        TileType[TileType["Bush2"] = 9] = "Bush2";
        TileType[TileType["Mushroom"] = 10] = "Mushroom";
        TileType[TileType["Wall"] = 11] = "Wall";
        TileType[TileType["Window"] = 12] = "Window";
        TileType[TileType["Wallangle"] = 13] = "Wallangle";
    })(exports.TileType || (exports.TileType = {}));
    var TileType = exports.TileType;
    var Cell = (function () {
        function Cell(floorId, structureId, floorTile, structureTile) {
            this.floorId = floorId;
            this.structureId = structureId;
            this.floorTile = floorTile;
            this.structureTile = structureTile;
        }
        Cell.prototype.color = function (color) {
            if (this.floorTile)
                this.floorTile.tint = color;
            if (this.structureTile)
                this.structureTile.tint = color;
        };
        Cell.prototype.destroy = function () {
            if (this.floorTile)
                this.floorTile.destroy();
            if (this.structureTile)
                this.structureTile.destroy();
        };
        Cell.prototype.isWalkable = function (walkables) {
            return _.includes(walkables, this.floorId) && !this.structureId;
        };
        Cell.prototype.isOpaque = function (opaques) {
            if (_.includes(opaques, this.structureId)) {
                return true;
            }
            return false;
        };
        return Cell;
    }());
    var Map = (function () {
        function Map() {
            this.coord = new Phaser.Point(0, 0);
            Map.size = GameContext_1.GameContext.config.map.size;
            Map.walkables = GameContext_1.GameContext.config.map.walkables;
            Map.opaques = GameContext_1.GameContext.config.map.opaques;
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
            Map.isoGroup = GameContext_1.GameContext.instance.add.group();
            Map.sortedGroup = GameContext_1.GameContext.instance.add.group();
            Map.isoGroup.enableBody = true;
            Map.sortedGroup.enableBody = true;
            Map.sortedGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
            this.easystar = new EasyStar.js();
            this.lightSource = new ShadowCasting_1.LightSource(this);
            this.initPlateau();
        }
        Object.defineProperty(Map.prototype, "plateauSize", {
            get: function () { return new Phaser.Point(Map.size.x, Map.size.y); },
            enumerable: true,
            configurable: true
        });
        Map.prototype.getPlateauFloor = function (point) {
            var line = this.plateau.floors[point.y];
            if (line === undefined || line[point.x] === undefined) {
                console.log("[WARNING: Map>getPlateauFloor] Tried to access (" + point.x + ", " + point.y + ") but it is undefined");
                return 0;
            }
            return line[point.x];
        };
        Map.prototype.getPlateauStructure = function (point) {
            return this.plateau.structures[point.y][point.x];
        };
        Map.prototype.isCellWalkable = function (point) {
            var cell = this.getCell(point);
            if (!cell || !cell.isWalkable(Map.walkables))
                return false;
            return true;
        };
        Map.prototype.isCellOpaque = function (point) {
            var cell = this.getCell(point);
            if (!cell || cell.isOpaque(Map.opaques))
                return true;
            return false;
        };
        Map.prototype.update = function () {
            var _this = this;
            if (!this.plateau)
                return;
            this.water.forEach(function (w) {
                w.isoZ = (-2 * Math.sin((GameContext_1.GameContext.instance.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((GameContext_1.GameContext.instance.time.now + (w.isoY * 8)) * 0.005));
                w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
            });
            this.ForEachCells(function (cell) { return cell.color(0x888888); });
            if (GameContext_1.GameContext.player) {
                this.lightSource.update(GameContext_1.GameContext.player.gridPosition, GameContext_1.GameContext.player.visionRadius).forEach(function (position) { return _this.getCell(position).color(0xffffff); });
            }
            var cursorPos = GameContext_1.GameContext.instance.iso.unproject(GameContext_1.GameContext.instance.input.activePointer.position);
            var selectedCell;
            this.ForEachCells(function (cell) {
                var inBounds = cell.floorTile.isoBounds.containsXY(cursorPos.x + Map.tileSize * 1.5, cursorPos.y + Map.tileSize * 1.5);
                if (inBounds) {
                    selectedCell = cell;
                    cell.color(0x86bfda);
                }
            });
            if (selectedCell && GameContext_1.GameContext.instance.input.activePointer.isDown) {
                selectedCell.color(0xff00ff);
            }
            GameContext_1.GameContext.instance.iso.topologicalSort(Map.sortedGroup);
        };
        Map.prototype.getCell = function (point) {
            return this.cells[point.x][point.y];
        };
        Map.prototype.ForEachCells = function (f) {
            this.cells.forEach(function (cells, i) {
                cells.forEach(function (cell, i) {
                    f(cell);
                });
            });
        };
        Map.prototype.initPlateau = function () {
            if (!this.plateau)
                return;
            if (this.cells)
                this.ForEachCells(function (cell) { return cell.destroy(); });
            this.water = [];
            var point = new Phaser.Point(0, 0);
            this.cells = [];
            for (point.x = 0; point.x < Map.size.x; point.x++) {
                this.cells[point.x] = [];
                for (point.y = 0; point.y < Map.size.y; point.y++) {
                    this.cells[point.x][point.y] = new Cell(null, null, null, null);
                    var structureId = this.getPlateauStructure(point);
                    var floorId = this.getPlateauFloor(point);
                    if (structureId != 0) {
                        var structureTile = GameContext_1.GameContext.instance.add.isoSprite(point.x * Map.tileSize, point.y * Map.tileSize, 0, 'tileset', this.tileArray[structureId], Map.sortedGroup);
                        structureTile.anchor.set(0.5, 1);
                        structureTile.smoothed = true;
                        structureTile.body.moves = false;
                        this.cells[point.x][point.y].structureId = structureId;
                        this.cells[point.x][point.y].structureTile = structureTile;
                    }
                    var floorTile = GameContext_1.GameContext.instance.add.isoSprite(point.x * Map.tileSize, point.y * Map.tileSize, 0, 'tileset', this.tileArray[floorId], Map.isoGroup);
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
            GameContext_1.GameContext.instance.iso.topologicalSort(Map.sortedGroup);
        };
        Map.prototype.changeMap = function (mapData) {
            this.coord = mapData.coord;
            this.plateau = mapData;
            this.initPlateau();
        };
        Map.tileSize = 32;
        return Map;
    }());
    exports.Map = Map;
});
//# sourceMappingURL=Map.js.map