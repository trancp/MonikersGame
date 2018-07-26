import { Action } from '@ngrx/store';

export const UPDATE_ROOM = '[room] UPDATE';
export const UPDATE_ROOM_SUCCESS = '[room] UPDATE SUCCESS';
export const START_GAME_TYPE = '[room] Start Game';
export const START_GAME_SUCCESS_TYPE = '[room] Start Game Success';
export const INIT_ROOM_TYPE = '[room] Init';

export class RoomActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function UpdateRoom(payload: any): RoomActions {
    return new RoomActions(UPDATE_ROOM, payload);
}

export function UpdateRoomSuccess(payload: any): RoomActions {
    return new RoomActions(UPDATE_ROOM_SUCCESS, payload);
}

export function StartGame(payload?: any): RoomActions {
    return new RoomActions(START_GAME_TYPE, payload);
}

export function InitRoom(): RoomActions {
    return new RoomActions(INIT_ROOM_TYPE);
}
