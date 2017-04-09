import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import * as Action from './Action';
import { Map } from './Map';
import { GameEventHandler } from './GameEventHandler';
import { Server } from './Server';
import { Element } from './Element';
import { Item, Slot, Bonuses } from './Item';

var config = require('../public/shared/config');

class Inventory {
    public items: Item[];

    private equiped: { [key: number]: Item };

    constructor() {
        this.items = [];
        this.equiped = {};
    }

    public add(item: Item) {
        this.items.push(item);

        // auto-equip if nothing
        if (!this.equiped[item.slot]) {
            this.equiped[item.slot] = item;
        }
    }

    public getBonuses(): Bonuses {
        return _.map<Item, Bonuses>(this.equiped, (i: Item) => i.bonuses)
                .reduce<Bonuses>(
                    (b1, b2) => { return { armorBonus: b1.armorBonus + b2.armorBonus, damageBonus: b1.damageBonus + b2.damageBonus } },
                    { armorBonus: 0, damageBonus: 0 });
    }
}

export abstract class Character extends Element {
    public hp: number;
    public maxHp: number;
    public type: string;
    public inventory: Inventory;
    public baseDamage: number;
    public baseArmor: number;

    private turnAction: Action.IAction = null;

    constructor(gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition);

        this.type = type;
        this.hp = config.characters[type].maxHp;
        this.maxHp = config.characters[type].maxHp;
        this.inventory = new Inventory();

        this.baseDamage = 0;
        this.baseArmor = 0;
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

    public getDamage() {
        return this.baseDamage + this.inventory.getBonuses().damageBonus;
    }

    public getArmor() {
        return this.baseArmor + this.inventory.getBonuses().armorBonus;
    }

    // Implemented in implementing classes
    public abstract reactToAttack(attackerGuid: string): void;

    public die() {
        this.inventory.items.forEach(item => {
            item.mapPosition = this.mapPosition;
            item.gridPosition = this.gridPosition;

            GameEventHandler.itemsCollection.add(item);
        });
    }
}
