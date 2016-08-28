/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {ICoordObject} from "./utils/CoordDic";

export class Map implements ICoordObject {
    private floors: number[][];
    private structures: number[][];
    private size: Geo.IPoint;
    private walkables: number[];
    private opaques: number[];
    private coord: Geo.IPoint;

    constructor(floors: number[][], structures: number[][], size: Geo.IPoint, walkables: number[], opaques: number[], coord: Geo.IPoint) {
        this.floors = floors;
        this.structures = structures;
        this.size = size;
        this.walkables = walkables
        this.opaques = opaques
        this.coord = coord;
    }

    public isCaseWalkable(point: Geo.IPoint): boolean {
        if (point.x < 0 || point.x > this.size.x - 1 || point.y < 0 || point.y > this.size.y - 1)
            return false;

        return _.includes(this.walkables, this.getFloor(point)) && this.getStructure(point) == 0;
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
        return this.coord;
    }

    public isPathWalkable(path: Geo.IPoint[]) {
        // Every case in path should be walkable and distant from one case
        var prevPoint: Geo.IPoint = null;

        for (var i = 0; i < path.length; i++) {
            if (!this.isCaseWalkable(path[i]))
                return false;
            if (prevPoint && Geo.Tools.distance(path[i], prevPoint) > 1)
                return false;
            prevPoint = path[i];
        }
        return true;
    }

    public toMessage(): any {
        return _.pick(this, ["floors", "structures", "size", "walkables", "opaques", "coord"]);
    }
}
