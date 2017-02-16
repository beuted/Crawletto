/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from '../utils/Geo';
import { Element } from '../Element';

export class ElementsHandler<T extends Element> {

    public elements: T[];

    constructor() {
        this.elements = [];
    }

    public add(elt: T) {
        this.elements.push(elt);
    }

    public getAll() {
        return this.elements;
    }

    /// Find element by GUID
    public get(guid: string): T {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].guid == guid)
                return this.elements[i];
        };

        return null;
    }

    public remove(guid: string) {
        this.removeSeveral([guid]);
    }

    public removeSeveral(guids: string[]) {
        var removed = _.remove(this.elements, (elt) => { return _.includes(guids, elt.guid); });
        if (removed.length !== guids.length) {
            console.error('Can\'t remove elements with guids: ' + _.difference(guids, _.map(removed, elt => elt.guid)));
        }
    }

    /// Get an element on a map at a certain position
    public getAllOnMapAtPosition(coordMap: Geo.IPoint, coord: Geo.IPoint): T[] {
        return _.filter(this.elements, function (elt) {
            return elt.mapPosition.x == coordMap.x && elt.mapPosition.y == coordMap.y
                && elt.gridPosition.x == coord.x && elt.gridPosition.y == coord.y;
        });
    }

    public getAllOnMap(mapCoord: Geo.IPoint): T[] {
        return _.filter(this.elements, function (elt) {
            return elt.mapPosition.x == mapCoord.x && elt.mapPosition.y == mapCoord.y;
        });
    }
}
