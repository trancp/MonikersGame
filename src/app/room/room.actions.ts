import { Action } from '@ngrx/store';

export const GET_ROOM = '[room] Get';
export const GET_ROOM_SUCCESS = '[room] Get Success';
export const CREATE_ROOM = '[room] CREATE';
export const CREATE_ROOM_SUCCESS = '[room] CREATE SUCCESS';
export const UPDATE_ROOM = '[room] UPDATE';
export const UPDATE_ROOM_SUCCESS = '[room] UPDATE SUCCESS';
export const START_GAME_TYPE = '[room] Start Game';
export const START_GAME_SUCCESS_TYPE = '[room] Start Game Success';
export const RESET_ROOM = '[room] Reset';
export const INIT_ROOM_TYPE = '[room] Init';

export class RoomActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function GetRoom(payload: any): RoomActions {
    return new RoomActions(GET_ROOM, payload);
}

export function GetRoomSuccess(payload: any): RoomActions {
    return new RoomActions(GET_ROOM_SUCCESS, payload);
}

export function CreateRoom(payload: any): RoomActions {
    return new RoomActions(CREATE_ROOM, payload);
}

export function CreateRoomSuccess(payload: any): RoomActions {
    return new RoomActions(CREATE_ROOM_SUCCESS, payload);
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

export function StartGameSuccess(payload: any): RoomActions {
    return new RoomActions(START_GAME_SUCCESS_TYPE, payload);
}

export function ResetRoom(): RoomActions {
    return new RoomActions(RESET_ROOM);
}

export function InitRoom(): RoomActions {
    return new RoomActions(INIT_ROOM_TYPE);
}
