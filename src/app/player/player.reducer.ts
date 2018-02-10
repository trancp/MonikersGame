import {
    PlayerActions,
    CREATE_PLAYER,
    CREATE_PLAYER_SUCCESS,
    GET_PLAYER,
    GET_PLAYER_SUCCESS,
    UPDATE_PLAYER,
    UPDATE_PLAYER_SUCCESS,
    UPDATE_PLAYER_FAIL,
    DELETE_PLAYER,
    DELETE_PLAYER_FAIL,
    DELETE_PLAYER_SUCCESS,
} from './player.actions';
import { Player } from '../interfaces/player.model';

export function playerReducer(playerState: Player, action: PlayerActions) {
    switch (action.type) {
        case GET_PLAYER:
            return {
                ...playerState,
                loading: true,
            };
        case GET_PLAYER_SUCCESS:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        case UPDATE_PLAYER:
            return {
                ...playerState,
                ...action.payload,
                loading: true,
            };
        case UPDATE_PLAYER_SUCCESS:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        case UPDATE_PLAYER_FAIL:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        case DELETE_PLAYER:
            return {
                ...playerState,
                ...action.payload,
                loading: true,
            };
        case DELETE_PLAYER_SUCCESS:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        case DELETE_PLAYER_FAIL:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        case CREATE_PLAYER:
            return {
                ...playerState,
                loading: true,
            };
        case CREATE_PLAYER_SUCCESS:
            return {
                ...playerState,
                ...action.payload,
                loading: false,
            };
        default:
            return playerState;
    }

}
