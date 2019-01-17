import { Player } from './player.model';

export interface Room {
    code?: string;
    error?: string;
    gameOver?: boolean;
    loading?: boolean;
    name?: string;
    numOfWords?: number;
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
    word?: number;
    words?: string[];
}

interface Team {
    isTurn?: boolean;
    name?: string;
    teamId?: number;
    words?: string[];
}

export const DEFAULT_ROOM_PROPERTIES = {
    gameOver: false,
    started: false,
};
