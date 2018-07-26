import { DEFAULT_ROOM_PROPERTIES, Room } from '../interfaces/room.model';
import {
    RESET_ROOM,
    RoomActions,
    START_GAME_SUCCESS_TYPE,
    START_GAME_TYPE,
    UPDATE_ROOM,
    UPDATE_ROOM_SUCCESS,
} from './room.actions';

export function roomReducer(state: Room, action: RoomActions) {
    switch (action.type) {

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
