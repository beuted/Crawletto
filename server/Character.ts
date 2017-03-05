import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import * as Action from './Action';
import { Map } from './Map';
import { GameEventHandler } from './GameEventHandler';
import { Server } from './Server';
import { Element } from './Element';
import { Item } from './Item';

var config = require('../public/shared/config');

export class Character extends Element {
    public hp: number;
    public maxHp: number;
    public type: string;
    public inventory: Item[];

    private turnAction: Action.IAction = null;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition);

        this.type = type;
        this.hp = config.characters[type].maxHp;
        this.maxHp = config.characters[type].maxHp;
        this.inventory = [];
    }

    public toMessage(): { guid: string, gridPosition: Geo.IPoint, hp: number } {
        return <{ guid: string, gridPosition: Geo.IPoint, hp: number }>_.pick(this, ["guid", "gridPosition", "mapPosition", "hp", "type"]);
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
}
