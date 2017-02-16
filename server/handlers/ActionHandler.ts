/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import { GameEventHandler } from '../GameEventHandler';

export class ActionHandler {
    private turnTime: number;  // time it takes to perform an action in ms
    private actionScheduler: NodeJS.Timer;
    private isNextActionReady: boolean;

    constructor() {
        this.isNextActionReady = true
        this.turnTime = 250;
    }

    public tryExecuteTurn() {
        if (!GameEventHandler.playersHandler.allPlayersPlannedAction() || ! this.isNextActionReady)
            return;

        GameEventHandler.playersHandler.executeActions();
        GameEventHandler.aisHandler.calculateNextActions();
        GameEventHandler.aisHandler.executeActions();

        this.isNextActionReady = false;
        setTimeout(() => { this.isNextActionReady = true; }, this.turnTime);
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }

}
