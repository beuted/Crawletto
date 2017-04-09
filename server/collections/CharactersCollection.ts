import * as _ from 'lodash';
import { Character } from '../Character';
import { Player } from '../Player';
import { Move } from '../Action';
import { GameEventHandler } from '../GameEventHandler';
import { ElementsCollection } from './ElementsCollection';
import { Server } from '../Server';

export class CharactersCollection<T extends Character> extends ElementsCollection<T> {
    constructor() {
        super();
    }

    public executeActions() {
        this.elements.forEach(elt => {
            elt.executeAction();
        });
    }
}
