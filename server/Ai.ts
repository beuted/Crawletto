/// <reference path="typings/tsd.d.ts" />

import * as Geo from './utils/Geo';
import {Move} from './Action';
import {Character} from './Character';

export class Ai extends Character {

    constructor(position: Geo.IPoint) {
        super(position);
    }

    public calculateNextAction() {
        var XorY: boolean = !!Math.round(Math.random());
        var moveDirection = Math.floor(Math.random() * 3) - 1;
        this.planAction(new Move({ x: this.gridPosition.x + (XorY ? moveDirection : 0), y: this.gridPosition.y + (!XorY ? moveDirection : 0) }));
    }
}
