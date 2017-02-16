/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as EasyStar from 'easystarjs';
import * as Geo from './utils/Geo';
import { ICoordObject } from './utils/CoordDic';

export class Map implements ICoordObject {
    private floors: number[][];
    private structures: number[][];
    private size: Geo.IPoint;
    private walkables: number[];
    private opaques: number[];
    private position: Geo.IPoint;

    private easystar: EasyStar.js;

    constructor(floors: number[][], structures: number[][], size: Geo.IPoint, walkables: number[], opaques: number[], position: Geo.IPoint) {
        this.floors = floors;
        this.structures = structures;
        this.size = size;
        this.walkables = walkables
        this.opaques = opaques
        this.position = position;

        // init easystar.js
        this.easystar = new EasyStar.js();
        this.easystar.enableSync();
        this.easystar.disableDiagonals();
        var easystarFloorGrid = _.map(this.floors, arrayFloors => _.map(arrayFloors, x => { return _.includes(this.walkables, x) ? 1 : 0; }));
        var easystarStructureGrid = _.map(this.structures, arrayStructures => _.map(arrayStructures, x => { return  x == 0 ? 1 : 0; }));
        var easystarGrid = _.zipWith(easystarFloorGrid, easystarStructureGrid, (array1, array2) => _.zipWith(array1, array2, (x1, x2) => x1 == 1 && x2 == 1 ? 1 : 0));
        this.easystar.setGrid(<number[][]>easystarGrid);
        this.easystar.setAcceptableTiles([1]);
    }

    public isCellWalkable(point: Geo.IPoint): boolean {
        if (point.x < 0 || point.x > this.size.x - 1 || point.y < 0 || point.y > this.size.y - 1)
            return false;

        return _.includes(this.walkables, this.getFloor(point)) && !this.getStructure(point);
    }

    public getSize(): Geo.IPoint {
        return this.size;
    }

    public getFloor(point: Geo.IPoint): any {
        return this.floors[point.y][point.x]
    }

    public getStructure(point: Geo.IPoint): any {
        return this.structures[point.y][point.x]
    }

    public getCoord(): Geo.IPoint {
        return this.position;
    }

    public isPathWalkable(path: Geo.IPoint[]) {
        // Every case in path should be walkable and distant from one case
        var prevPoint: Geo.IPoint = null;

        for (var i = 0; i < path.length; i++) {
            if (!this.isCellWalkable(path[i]))
                return false;
            if (prevPoint && Geo.Tools.distance(path[i], prevPoint) > 1)
                return false;
            prevPoint = path[i];
        }
        return true;
    }

    public toMessage(): any {
        return _.pick(this, ['floors', 'structures', 'position']);
    }

    public findPath(start: Geo.IPoint, end: Geo.IPoint) {
        var resultPath = null;
        this.easystar.findPath(start.x, start.y, end.x, end.y, function( path ) {
            resultPath = path;
        });
        this.easystar.calculate();
        return resultPath;
    }

}
