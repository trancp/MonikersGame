import { Player } from './player.model';

export interface Room {
    code?: string;
    error?: string;
    gameOver?: boolean;
    loading?: boolean;
    name?: string;
    players?: any[];
    pushKey?: string;
    round?: number;
    started?: boolean;
    teams?: Team[];
    teamToStart?: number;
    timer?: string;
    turn?: number;
    turnOrder?: Player[];
    vip?: boolean;
    words?: string[];
}

interface Team {
    name?: string;
    words?: string[];
    isTurn?: boolean;
}

export const DEFAULT_ROOM_PROPERTIES = {
    gameOver: false,
    started: false,
};
