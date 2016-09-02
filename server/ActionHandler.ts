/// <reference path="typings/tsd.d.ts" />

import * as _ from 'lodash';
import {GameEventHandler} from './GameEventHandler';

export class ActionHandler {
    private actionTime : number;  // time it takes to perform an action in second
    private actionScheduler: NodeJS.Timer;

    constructor() {
        this.actionTime = 1;
        this.actionScheduler = setInterval(
            (function(self) {
                return function() { self.execute() }
            })(this), this.actionTime * 1000);
    }

    private execute() {
        GameEventHandler.playersHandler.executeActions();
        GameEventHandler.aisHandler.calculateNextActions();
        GameEventHandler.aisHandler.executeActions();
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }

}
