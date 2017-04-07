import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Move, Attack, IAction } from './Action';
import { Character } from './Character';
import { GameEventHandler } from './GameEventHandler';

var config = require('../public/shared/config');

export class Ai extends Character {
    private isAggressive: boolean = false;
    public enemiesGuids: string[];


    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition, type);

        this.enemiesGuids = [];

        this.isAggressive = config.characters[type].isAggressive;
    }

    public calculateNextAction() {
        let action: IAction;
        if (this.isAggressive)
            action = this.getAggressiveAction();
        else
            action = this.getPeacefulAction();
            
        this.planAction(action);
    }

    public reactToAttack(attackerGuid: string): void {
        this.isAggressive = true;
        if (this.enemiesGuids.indexOf(attackerGuid) === -1)
            this.enemiesGuids.push(attackerGuid);
    }

    private getAggressiveAction(): IAction {
        let target = this.getTarget();

        // If ai is peaceful just do a peacfull action
        if (target === null)
            return this.getPeacefulAction();

        // If a player is just next to you, attack him
        if (target && Geo.Tools.distance(target.gridPosition, this.gridPosition) == 1) {
            return new Attack(target.guid, this.guid);
        }

        var path: { x: number, y: number }[] | null = null;
        if (target) {
            path = GameEventHandler.mapsCollection.getMap(this.mapPosition).findPath(this.gridPosition, target.gridPosition);
        }
        
        // If we can't find a way to a player just randomly walk
        if (!path || !path[1])
            return this.getPeacefulAction();

        // Else move to the nearest player
        return new Move({ x: path[1].x, y: path[1].y });
    }

    private getPeacefulAction(): IAction {
        var XorY: boolean = !!Math.round(Math.random());
        var moveDirection = Math.floor(Math.random() * 3) - 1;
        return new Move({ x: this.gridPosition.x + (XorY ? moveDirection : 0), y: this.gridPosition.y + (!XorY ? moveDirection : 0) });
    }

    private getTarget(): Character | null {
        let target: Character | null = null;

        for (let i = this.enemiesGuids.length; i > 0; i--) {
            target = GameEventHandler.playersCollection.get(this.enemiesGuids[i]);
            if (target !== null)
                break;
        }

        if (target === null && this.isAggressive) {
            let characterOnMap = GameEventHandler.playersCollection.getAllOnMap(this.mapPosition);

            let minDist = Number.MAX_VALUE;
            let closestChar: Character = null;
            characterOnMap.forEach((char: Character) => {
                let dist = Geo.Tools.distance(char.gridPosition, this.gridPosition);
                if (dist < minDist) {
                    minDist = dist;
                    closestChar = char;
                }
            });
            target = closestChar;
        }

        return target;
    }
}
