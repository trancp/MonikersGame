import { Room, DEFAULT_ROOM_PROPERTIES } from '../interfaces/room.model';
import {
    RoomActions,
    GET_ROOM,
    GET_ROOM_SUCCESS,
    CREATE_ROOM,
    CREATE_ROOM_SUCCESS,
    UPDATE_ROOM,
    UPDATE_ROOM_SUCCESS,
    START_GAME_TYPE,
    START_GAME_SUCCESS_TYPE,
    RESET_ROOM,
} from './room.actions';

export function roomReducer(state: Room, action: RoomActions) {
    switch (action.type) {

        case GET_ROOM:
            return {
                ...state,
                loading: true,
            };

        case GET_ROOM_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
            };

        case CREATE_ROOM:
            return {
                ...state,
                loading: true,
            };

        case CREATE_ROOM_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
            };

        case UPDATE_ROOM:
            return {
                ...state,
                loading: true,
            };

        case UPDATE_ROOM_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false,
            };

        case START_GAME_TYPE:
            return {
                ...state,
                loading: true,
            };

        case START_GAME_SUCCESS_TYPE:
            return {
                ...state,
                loading: false,
                ...action.payload,
            };

        case RESET_ROOM:
            return {
                ...DEFAULT_ROOM_PROPERTIES,
            };

        default:
            return state;
    }
}
