/// <reference path="../typings/index.d.ts" />

import * as Geo from "../utils/Geo";
import { CoordDic } from "../utils/CoordDic";
import { Map } from "../Map";
import { MapGenerator } from "../MapGenerator";

export class MapsHandler {
    private maps: CoordDic<Map>;
    private mapGenerator: MapGenerator;

    constructor() {
        this.maps = new CoordDic<Map>();
        this.mapGenerator = new MapGenerator("this is a random seed");

        var map: Map = this.mapGenerator.generate({ x: 0, y: 0 });
        this.maps.add(map)
    }

    // Get the map at @position, if not found, load it
    public getMap(position: Geo.IPoint): Map {
        var map = this.maps.get(position);
        if (!map)
            map = this.loadMap(position);
        return map;
    }

    private loadMap(position: Geo.IPoint): Map {
        var map: Map = this.mapGenerator.generate(position);
        if (!map)
            return null;

        this.maps.add(map);
        return map;
    }

}
