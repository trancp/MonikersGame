import { Room } from '../interfaces/room.model';
import {
    RoomActions,
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

        default:
            return state;
    }
}
