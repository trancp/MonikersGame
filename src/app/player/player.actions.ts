import { Action } from '@ngrx/store';

export const GET_PLAYER = '[player] GET';
export const GET_PLAYER_SUCCESS = '[player] GET SUCCESS';
export const UPDATE_PLAYER = '[player] UPDATE SUCCESS';
export const UPDATE_PLAYER_SUCCESS = '[player] UPDATE PLAYER SUCCESS';
export const UPDATE_PLAYER_FAIL = '[player] UPDATE PLAYER FAIL';
export const DELETE_PLAYER = '[player] DELETE PLAYER SUCCESS';
export const DELETE_PLAYER_SUCCESS = '[player] DELETE PLAYER SUCCESS';
export const DELETE_PLAYER_FAIL = '[player] DELETE PLAYER FAIL';
export const SET_PLAYER = '[player] DELETE PLAYER FAIL';
export const CREATE_PLAYER = '[player] CREATE';
export const CREATE_PLAYER_SUCCESS = '[player] CREATE SUCCESS';

export class PlayerActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function GetPlayer(payload: any): PlayerActions {
    return new PlayerActions(GET_PLAYER, payload);
}

export function GetPlayerSuccess(payload: any): PlayerActions {
    return new PlayerActions(GET_PLAYER_SUCCESS, payload);
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

export function DeletePlayer(): PlayerActions {
    return new PlayerActions(DELETE_PLAYER);
}

export function DeletePlayerSuccess(payload: any): PlayerActions {
    return new PlayerActions(DELETE_PLAYER_SUCCESS, payload);
}

export function DeletePlayerFail(): PlayerActions {
    return new PlayerActions(DELETE_PLAYER_FAIL);
}

export function SetPlayer(payload: any): PlayerActions {
    return new PlayerActions(SET_PLAYER, payload);
}
