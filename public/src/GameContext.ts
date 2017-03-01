import { Character } from './Character';
import { Map } from './Map';
import { RemoteCharactersCollection } from './RemoteCharactersCollection';
import { RemoteItemsCollection } from './RemoteItemsCollection';
import { SocketManager } from './SocketManager';

export interface IConfig {
    map: {
        walkables: number[],
        opaques: number[],
        size: { x: number, y: number }
    }

    characters: { [name: string]: ICharConfig }
}

export interface ICharConfig {
    maxHp: number,
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
    static remoteCharactersCollection: RemoteCharactersCollection;
    static remoteItemsCollection: RemoteItemsCollection;
    static map: Map;
    static socketManager: SocketManager;
    static config: IConfig;

    static debugActivated: boolean;

    static create() {
        if (!this.socketManager) this.socketManager = new SocketManager();
        if (!this.map) this.map = new Map();
        if (!this.remoteCharactersCollection) this.remoteCharactersCollection = new RemoteCharactersCollection();
        if (!this.remoteItemsCollection) this.remoteItemsCollection = new RemoteItemsCollection();

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
