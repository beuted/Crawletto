// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as Geo from './utils/Geo';
import * as Action from './Action';
import { Character } from './Character';
import { GameEventHandler } from './GameEventHandler';

export class Player extends Character {
    public socketId: string;

    constructor(socketId: string, gridPosition: Geo.IPoint, mapPosition: Geo.IPoint, type: string) {
        super(gridPosition, mapPosition, type);
        this.socketId = socketId;
    }

    public planAction(action: Action.IAction) {
        super.planAction(action);
        GameEventHandler.actionHandler.tryExecuteTurn()
    }
}
