/// <reference path="typings/tsd.d.ts" />

// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as _ from 'lodash';
import * as Geo from './utils/Geo';
import * as Action from './Action';
import {Map} from './Map';
import {GameEventHandler} from './GameEventHandler';
import {Server} from './Server';

export class Player {
    public mapPosition: Geo.IPoint;
    public gridPosition: Geo.IPoint;
    public guid: string;
    public socketId: string;

    private turnAction: Action.IAction = null;

    constructor(socketId: string, position: Geo.IPoint) {
        this.socketId = socketId;
        this.mapPosition = { x: 10, y: 10 };
        this.guid = this.generateGuid();
        this.gridPosition = { x: position.x, y: position.y };
    }

    public get map(): Map {
        return GameEventHandler.mapsHandler.getMap(this.mapPosition)
    }

    public toMessage(): { guid: string, gridPosition: Geo.IPoint } {
        return <{ guid: string, gridPosition: Geo.IPoint }> _.pick(this, ["guid", "gridPosition"]);
    }

    public planAction(action: Action.IAction) {
       this.turnAction = action;
    }

    public executeAction() {
        if (!this.turnAction)
            return;

        this.turnAction.execute(this);
        this.turnAction = null;

        this.update();
    }

    public update() {
        // Change player map if player as reach map borders in it's last action
        var mapSize: Geo.IPoint = this.map.getSize();
        var newMapPosition: Geo.IPoint = { x: this.mapPosition.x, y: this.mapPosition.y }
        var newGridPosition: Geo.IPoint = { x: this.gridPosition.x, y: this.gridPosition.y }

        if (this.gridPosition.x <= 0) {
            newMapPosition.x--;
            newGridPosition.x = mapSize.x - 2;
        } else if (this.gridPosition.x >= mapSize.x - 1) {
            newMapPosition.x++;
            newGridPosition.x = 1;
        }

        if (this.gridPosition.y <= 0) {
            newMapPosition.y--;
            newGridPosition.y = mapSize.y - 2;
        } else if (this.gridPosition.y >= mapSize.y - 1) {
            newMapPosition.y++;
            newGridPosition.y = 1;
        }

        var map = GameEventHandler.mapsHandler.getMap(newMapPosition);

        if ((this.mapPosition.x != newMapPosition.x || this.mapPosition.y != newMapPosition.y) && !!map) {
            var changeMapAction = new Action.ChangeMap(newMapPosition, newGridPosition);
            this.planAction(changeMapAction);
        }
    }

    //TODO do better, move or something
    private generateGuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
}
