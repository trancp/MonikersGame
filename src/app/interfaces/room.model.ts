import { Player } from './player.model';

export interface Room {
    gameOver?: boolean;
    players: any[];
    pushKey?: string;
    loading: boolean;
    error?: string;
    code: string;
    started: boolean;
    teams?: Team[];
    teamToStart: number;
    timer: string;
    round: number;
    turn: number;
    turnOrder: Player[];
    words: string[];
}

interface Team {
    name: string;
    words: string[];
    isTurn: boolean;
}

export const DEFAULT_ROOM_PROPERTIES = {
    gameOver: false,
    started: false
};
