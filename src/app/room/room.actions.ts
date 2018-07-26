import { Action } from '@ngrx/store';

export const UPDATE_ROOM = '[room] UPDATE';
export const UPDATE_ROOM_SUCCESS = '[room] UPDATE SUCCESS';

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
