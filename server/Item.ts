import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Element } from './Element';

export const enum Slot {
    HEAD = 1,
    BODY = 2,
    HAND = 3,
    CLOAK = 4
}

export interface Bonuses {
    damageBonus: number,
    armorBonus: number
}

export class Item extends Element {
    public type: string;
    public slot: Slot;
    public bonuses: Bonuses;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string, slot: Slot, bonuses: Bonuses) {
        super(gridPosition, mapPosition);

        this.type = type;
        this.slot = slot;
        this.bonuses = bonuses;
    }

    public toMessage(): { guid: string, gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string} {
        return <{ guid: string, gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string}>_.pick(this, ["guid", "gridPosition", "mapPosition", "type"]);
    }
}
