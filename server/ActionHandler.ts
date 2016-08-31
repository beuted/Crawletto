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
        _.forEach(GameEventHandler.playersHandler.getPlayers(), player => {
            player.executeAction();
        });
/*        _.forEach(GameEventHandler.aisHandler.getAis(), ai => {
            ai.executeAction();
        });*/
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }

}
