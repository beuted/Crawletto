import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Move, Attack } from './Action';
import { Character } from './Character';
import { GameEventHandler } from './GameEventHandler';

export class Ai extends Character {

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition, type);
    }

    public calculateNextAction() {
        var characterOnMap = GameEventHandler.playersCollection.getAllOnMap(this.mapPosition);

        var minDist = Number.MAX_VALUE;
        var closestChar: Character = null;
        characterOnMap.forEach((char: Character) => {
            var dist = Geo.Tools.distance(char.gridPosition, this.gridPosition);
            if (dist < minDist) {
                minDist = dist;
                closestChar = char;
            }
        });

        // If a player is just next to you, attack him
        if (closestChar && Geo.Tools.distance(closestChar.gridPosition, this.gridPosition) == 1) {
            this.planAction(new Attack(closestChar.guid, this.guid));
            return;
        }

        var path: {x: number, y: number}[] = null;
        if (closestChar) {
            path = GameEventHandler.mapsCollection.getMap(this.mapPosition).findPath(this.gridPosition, closestChar.gridPosition);
        }
        
        // If we can't find a way to a player just randomly walk
        if (!path || !path[1]) {
            var XorY: boolean = !!Math.round(Math.random());
            var moveDirection = Math.floor(Math.random() * 3) - 1;
            this.planAction(new Move({ x: this.gridPosition.x + (XorY ? moveDirection : 0), y: this.gridPosition.y + (!XorY ? moveDirection : 0) }));
            return;
        }

        // Else way to the nearest player
        this.planAction(new Move({ x: path[1].x, y: path[1].y }));
    }
}
