/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import * as Action from './Action';
import { Map } from './Map';
import { GameEventHandler } from './GameEventHandler';
import { Server } from './Server';

var config = require('../public/shared/config');

export class Character {
    public mapPosition: Geo.IPoint;
    public gridPosition: Geo.IPoint;
    public guid: string;
    public hp: number;
    public maxHp: number;
    public type: string;

    private turnAction: Action.IAction = null;

    constructor(position: Geo.IPoint, type: string) {
        this.mapPosition = { x: 10, y: 10 };
        this.guid = this.generateGuid();
        this.gridPosition = { x: position.x, y: position.y };
        this.type = type;
        this.hp = config.characters[type].maxHp;
        this.maxHp = config.characters[type].maxHp;
    }

    public get map(): Map {
        return GameEventHandler.mapsHandler.getMap(this.mapPosition)
    }

    public toMessage(): { guid: string, gridPosition: Geo.IPoint, hp: number } {
        return <{ guid: string, gridPosition: Geo.IPoint, hp: number }>_.pick(this, ["guid", "gridPosition", "hp", "type"]);
    }

    public havePlannedAction(): boolean {
        return !!this.turnAction;
    }

    public planAction(action: Action.IAction) {
        this.turnAction = action;
    }

    public executeAction() {
        if (!this.turnAction)
            return;

        this.turnAction.execute(this);
        this.turnAction = null;

        this.update();
    }

    public update() {
    }

    //TODO do better, move or something
    private generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
