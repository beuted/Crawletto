/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import { Ai } from './Ai';
import { Move } from './Action';
import { GameEventHandler } from './GameEventHandler';
import { CharactersHandler } from './CharactersHandler';

export class AisHandler extends CharactersHandler<Ai> {
    constructor() {
        super();
        this.characters.push(new Ai({ x: 5,  y: 9  }, 'zombie'));
        this.characters.push(new Ai({ x: 10, y: 15 }, 'zombie'));
        this.characters.push(new Ai({ x: 15, y: 15 }, 'zombie'));
    }

    public calculateNextActions() {
        _.forEach(this.characters, ai => {
            ai.calculateNextAction();
        });
    }
}
