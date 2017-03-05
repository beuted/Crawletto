import * as _ from 'lodash';
import { GameEventHandler } from '../GameEventHandler';

export class ActionCollection {
    private turnTime: number;  // time it takes to perform an action in ms
    private actionScheduler: NodeJS.Timer;
    private isNextActionReady: boolean;

    constructor() {
        this.isNextActionReady = true
        this.turnTime = 250;
    }

    public tryExecuteTurn() {
        if (!GameEventHandler.playersCollection.allPlayersPlannedAction() || ! this.isNextActionReady)
            return;

        GameEventHandler.playersCollection.executeActions();
        GameEventHandler.aisCollection.calculateNextActions();
        GameEventHandler.aisCollection.executeActions();

        this.isNextActionReady = false;
        setTimeout(() => { this.isNextActionReady = true; }, this.turnTime);
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }

}
