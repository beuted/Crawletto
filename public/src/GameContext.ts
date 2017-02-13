/// <reference path="../typings/index.d.ts" />

import { Character } from "./Character";
import { Map } from "./Map";
import { RemoteCharactersManager } from "./RemoteCharactersManager";
import { SocketManager } from "./SocketManager";

export interface IConfig {
    map: {
        walkables: number[],
        opaques: number[],
        size: { x: number, y: number }
    }

    characters: { [name: string]: ICharConfig }
}

export interface ICharConfig {
    maxLife: number,
    visionRadius: number, // in cell
    sprite: string,
    animations: {
        walkDown: number[],
        walkUp: number[],
        walkRight: number[],
        walkLeft: number[],
        fightDown: number[],
        fightUp: number[],
        fightRight: number[],
        fightLeft: number[]
    },
    animationFps: number,
    animationTime: number // in ms
}

export class GameContext {
    static instance: Phaser.Game;
    static player: Character;
    static remoteCharactersManager: RemoteCharactersManager;
    static map: Map;
    static socketManager: SocketManager;
    static config: IConfig;

    static debugActivated: boolean;

    static create() {
        if (!this.socketManager) this.socketManager = new SocketManager();
        if (!this.map) this.map = new Map();
        if (!this.remoteCharactersManager) this.remoteCharactersManager = new RemoteCharactersManager();

        // TODO: (wip) Add loader callbacks
        /*        GameContext.instance.load.onLoadComplete.add(() => {
                    console.debug("[Loader] Load complete");
                }, this);*/

        GameContext.instance.world.resize(2000, 1000);
    }

    static update() {
        // update the map
        this.map.update();
    }
}
