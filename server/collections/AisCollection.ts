import * as _ from 'lodash';
import { Ai } from '../Ai';
import { CharactersCollection } from './CharactersCollection';

export class AisCollection extends CharactersCollection<Ai> {
    constructor() {
        super();

        this.elements.push(new Ai({ x: 5,  y: 9  }, { x: 10,  y: 10  }, 'zombie'));
        this.elements.push(new Ai({ x: 10, y: 15 }, { x: 10,  y: 10  }, 'zombie'));
        this.elements.push(new Ai({ x: 15, y: 15 }, { x: 10,  y: 10  }, 'zombie'));
        this.elements.push(new Ai({ x: 15, y: 14 }, { x: 10,  y: 10  }, 'monk'));
    }

    public calculateNextActions() {
        this.elements.forEach(ai => {
            ai.calculateNextAction();
        });
    }
}
