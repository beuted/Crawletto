/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Move } from './Action';
import { Character } from './Character';
import { GameEventHandler } from './GameEventHandler';

export class Ai extends Character {

    constructor(position: Geo.IPoint, type: string) {
        super(position, type);
    }

    public calculateNextAction() {
        var XorY: boolean = !!Math.round(Math.random());
        var moveDirection = Math.floor(Math.random() * 3) - 1;
        var characterOnMap = GameEventHandler.playersHandler.getCharactersOnMap(this.mapPosition);

        var minDist = Number.MAX_VALUE;
        var closestChar = null;
        _.forEach(characterOnMap, char => {
            var dist = Geo.Tools.distance(char.gridPosition, this.gridPosition);
            if (dist < minDist) {
                minDist = dist;
                closestChar = char;
            }
        });

        console.log(this.gridPosition, closestChar.gridPosition);

        var path = GameEventHandler.mapsHandler.getMap(this.mapPosition).findPath(this.gridPosition, closestChar.gridPosition);
        
        if (!path)
            this.planAction(new Move({ x: this.gridPosition.x + (XorY ? moveDirection : 0), y: this.gridPosition.y + (!XorY ? moveDirection : 0) }));
        else
            this.planAction(new Move({ x: path[1].x, y: path[1].y }));
    }
}
