/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import {Ai} from './Ai';
import {Move} from './Action';
import {GameEventHandler} from './GameEventHandler';
import {CharactersHandler} from './CharactersHandler';

export class AisHandler extends CharactersHandler<Ai> {
    constructor() {
        super();
        var ai = new Ai({ x: 5, y: 9 });
        this.characters.push(ai);
    }

    public calculateNextActions() {
        _.forEach(this.characters, ai => {
            ai.calculateNextAction();
        });
    }
}
