/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {CoordDic, ICoordObject} from "./utils/CoordDic";
import {Map} from "./Map";
import * as seedrandom from "seedrandom";
import * as Voronoi from "voronoi";

class MapSeed implements ICoordObject {
    public biome: number;
    public isBorder: boolean;

    private coord: Geo.IPoint;

    constructor(coord: Geo.IPoint, biome: number, isBorder: boolean) {
        this.coord = coord;
        this.biome = biome;
        this.isBorder = isBorder;
    }

    public getCoord(): Geo.IPoint {
        return this.coord;
    }
}

class MapSeedDic extends CoordDic<MapSeed> {
    constructor() {
        super();
    }
}

export class MapGenerator {
    private rng: any;
    private seed: string;
    private walkables: number[];
    private opaques: number[];
    private size: Geo.IPoint;
    private mapSeeds: MapSeedDic;

    private mapDefault: any;

    constructor(seed: string) {
        this.mapSeeds = new MapSeedDic();
        this.rng = seedrandom(seed);
        this.seed = seed;

        this.walkables = [1, 2, 3, 4, 5, 6, 7];
        this.opaques = [8, 9, 10, 11, 13];
        this.size = { x: 32, y: 32 };

        this.initSampleMaps();
    }

    /**
     * Generate a Map depending on the positon, return null if map out of boundaries.
     */
    public generate(coord: Geo.IPoint): Map {
        return new Map(this.mapDefault.tiles, this.size, this.walkables, this.opaques, coord);
    }

    private initSampleMaps() {
        this.mapDefault = require('../public/maps/map-default');
    }

    // TODO: unused
    private buildMapSeeds() {
        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: 50, yt: 0, yb: 50 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        var sites = [{ x: 11, y: 10 }, { x: 11, y: 21 }, { x: 10, y: 46 }, { x: 25, y: 24 }, { x: 25, y: 27 }, { x: 24, y: 35 }, { x: 30, y: 12 }, { x: 35, y: 25 }, { x: 36, y: 30 }];

        var diagram = voronoi.compute(sites, bbox);

        for (var i = 0; i < diagram.cells.length; i++) {
            var polygone = Geo.Tools.getCasesInPolygone(diagram.cells[i].halfedges);
            var edges = Geo.Tools.getCasesInPolygoneEdges(diagram.cells[i].halfedges);

            _.forEach(polygone, (point: Geo.IPoint) => {
                this.mapSeeds.add(new MapSeed(point, i % 2, false))
            }, this);

            _.forEach(edges, (point: Geo.IPoint) => {
                this.mapSeeds.add(new MapSeed(point, i % 2, true))
            }, this);
        }
    }
}
