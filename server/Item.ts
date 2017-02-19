/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Element } from './Element';

export class Item extends Element {
    public type: string;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition);

        this.type = type;
    }

    public toMessage(): { guid: string, gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string} {
        return <{ guid: string, gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string}>_.pick(this, ["guid", "gridPosition", "mapPosition", "type"]);
    }
}
