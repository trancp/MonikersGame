import {Action} from '@ngrx/store';

export const GET_ROOMS = '[rooms] GET';
export const GET_ROOMS_SUCCESS = '[rooms] GET SUCCESS';

export class RoomsActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function GetRooms(payload?: any): RoomsActions {
    return new RoomsActions(GET_ROOMS, payload);
}

export function GetRoomsSuccess(payload: any): RoomsActions {
    return new RoomsActions(GET_ROOMS_SUCCESS, payload);
}
