/// <reference path="typings/index.d.ts" />

import * as _ from 'lodash';
import {Ai} from './Ai';
import {Move} from './Action';
import {GameEventHandler} from './GameEventHandler';

export class AisHandler {

    private ais: Ai[];

    constructor() {
        this.ais = [];

        var ai = new Ai({ x: 5, y: 9 });
        this.ais.push(ai);
    }

    public calculateNextActions() {
        _.forEach(this.ais, ai => {
            ai.calculateNextAction();
        });
    }

    public executeActions() {
        _.forEach(this.ais, ai => {
            ai.executeAction();
        });
    }

    public getAis() {
        return this.ais;
    }
}
