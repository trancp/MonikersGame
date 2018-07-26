import { Action } from '@ngrx/store';

export const UPDATE_PLAYER = '[player] UPDATE SUCCESS';
export const UPDATE_PLAYER_SUCCESS = '[player] UPDATE PLAYER SUCCESS';
export const UPDATE_PLAYER_FAIL = '[player] UPDATE PLAYER FAIL';
export const CREATE_PLAYER = '[player] CREATE';
export const CREATE_PLAYER_SUCCESS = '[player] CREATE SUCCESS';

export class PlayerActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function UpdatePlayer(payload: any): PlayerActions {
    return new PlayerActions(UPDATE_PLAYER, payload);
}

export function UpdatePlayerSuccess(payload: any): PlayerActions {
    return new PlayerActions(UPDATE_PLAYER_SUCCESS, payload);
}

export function UpdatePlayerFail(): PlayerActions {
    return new PlayerActions(UPDATE_PLAYER_FAIL);
}

export function CreatePlayer(payload: any): PlayerActions {
    return new PlayerActions(CREATE_PLAYER, payload);
}

export function CreatePlayerSuccess(payload: any): PlayerActions {
    return new PlayerActions(CREATE_PLAYER_SUCCESS, payload);
}
