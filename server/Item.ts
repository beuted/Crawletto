/// <reference path="typings/index.d.ts" />

import * as Geo from './utils/Geo';
import { Element } from './Element';

export class Item extends Element {
    public type: string;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition);

        this.type = type;
    }
}
