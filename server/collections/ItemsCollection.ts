import * as _ from 'lodash';
import { Item } from '../Item';
import { ElementsCollection } from './ElementsCollection';

export class ItemsCollection extends ElementsCollection<Item> {
    constructor() {
        super();

        this.elements.push(new Item({ x: 1,  y: 1  }, { x: 10,  y: 10  }, 'iron sword'));
        this.elements.push(new Item({ x: 9,  y: 15 }, { x: 10,  y: 10  }, 'leather armor'));
        this.elements.push(new Item({ x: 14, y: 15 }, { x: 10,  y: 10  }, 'leather cloak'));
        this.elements.push(new Item({ x: 12, y: 14 }, { x: 10,  y: 10  }, 'leather helmet'));
    }
}
