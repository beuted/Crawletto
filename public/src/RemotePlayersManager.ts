/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import {GameContext} from "./GameContext";
import {Player} from "./Player";

export class RemotePlayersManager {
    private remotePlayers: Player[];

    constructor() {
        this.remotePlayers = [];
    }

    public add(p: Player) {
        this.remotePlayers.push(p);
    }

    public addFromJson(playerJson: { gridPosition: Phaser.Point, guid: string }) {
        var remotePlayer = new Player(playerJson.gridPosition.x, playerJson.gridPosition.y, playerJson.guid, 'pingu');
        this.add(remotePlayer);
    }

    public addAllFromJson(playersJson: { gridPosition: Phaser.Point, guid: string }[]) {
        _.forEach(playersJson, function(playerJson: any) {
            this.addFromJson(playerJson);
        }, this);
    }

    public removeByGuid(guid: string) {
        var removePlayer = this.playerByGuid(guid);

        // Player not found
        if (!removePlayer) {
            console.warn("Player not found: " + guid);
            return;
        };

        removePlayer.destroy();

        this.remotePlayers.splice(this.remotePlayers.indexOf(removePlayer), 1);
    }

    public removeAll() {
        _.forEach(this.remotePlayers, function(remotePlayer) {
            remotePlayer.destroy();
        });
        this.remotePlayers = []
    }

    public moveByGuid(guid: string, destPoint: any) {
        var playerToMove = this.playerByGuid(guid);

        if (!playerToMove) {
            console.warn("Player not found: " + guid);
            return;
        };

        // Update player position
        playerToMove.move(destPoint)
    }

    public arePresentAt(point: Phaser.Point) {
        for (var i = 0; i < this.remotePlayers.length; i++) {
            if (Phaser.Point.equals(this.remotePlayers[i].gridPosition, point)) {
                return true;
            }
        }

        return false
    }

    // Find player by GUID
    private playerByGuid(guid): Player {
        for (var i = 0; i < this.remotePlayers.length; i++) {
            if (this.remotePlayers[i].guid == guid)
                return this.remotePlayers[i];
        };

        return null;
    };
}
