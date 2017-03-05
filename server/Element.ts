import * as Geo from './utils/Geo';
import { Map } from './Map';
import { GameEventHandler } from './GameEventHandler';

export class Element {
    public guid: string;
    public gridPosition: Geo.IPoint;
    public mapPosition: Geo.IPoint;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint) {
        this.guid = Element.generateGuid();
        this.gridPosition = { x: gridPosition.x, y: gridPosition.y };
        this.mapPosition = { x: mapPosition.x, y: mapPosition.y };
    }

    public get map(): Map {
        return GameEventHandler.mapsCollection.getMap(this.mapPosition)
    }

    private static generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
