import * as _ from 'lodash';
import { Item, Slot } from '../Item';
import { ElementsCollection } from './ElementsCollection';

export class ItemsCollection extends ElementsCollection<Item> {
    constructor() {
        super();

        this.elements.push(new Item({ x: 4,  y: 4  }, { x: 10,  y: 10  }, 'iron sword', Slot.HAND, { damageBonus: 20, armorBonus: 0 }));
        this.elements.push(new Item({ x: 9,  y: 15 }, { x: 10,  y: 10  }, 'leather armor', Slot.BODY, { damageBonus: 0, armorBonus: 10 }));
        this.elements.push(new Item({ x: 14, y: 15 }, { x: 10,  y: 10  }, 'leather cloak', Slot.CLOAK, { damageBonus: 0, armorBonus: 5 }));
        this.elements.push(new Item({ x: 12, y: 14 }, { x: 10,  y: 10  }, 'leather helmet', Slot.HEAD, { damageBonus: 0, armorBonus: 5 }));
        this.elements.push(new Item({ x: 9,  y: 16 }, { x: 10,  y: 9   }, 'leather armor', Slot.BODY, { damageBonus: 0, armorBonus: 10 }));
        this.elements.push(new Item({ x: 14, y: 16 }, { x: 10,  y: 9   }, 'leather cloak', Slot.CLOAK, { damageBonus: 0, armorBonus: 5 }));
        this.elements.push(new Item({ x: 12, y: 15 }, { x: 10,  y: 9   }, 'leather helmet', Slot.HEAD, { damageBonus: 0, armorBonus: 5 }));
    }
}
