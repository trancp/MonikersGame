import { Player } from './player.model';

export interface DataTransfer {
    player: Player;
    posX: number;
    posY: number;
    dropZones: any;
    dropZoneIndex: number;
    teamList: string;
}
