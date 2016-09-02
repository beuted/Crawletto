/// <reference path="typings/tsd.d.ts" />

// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as Geo from './utils/Geo';
import {Character} from './Character';

export class Player extends Character {
    public socketId: string;

    constructor(socketId: string, position: Geo.IPoint) {
        super(position);
        this.socketId = socketId;

    }
}
