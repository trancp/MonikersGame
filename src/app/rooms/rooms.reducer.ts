import { Rooms } from '../interfaces/rooms.model';
import { GET_ROOMS, GET_ROOMS_SUCCESS, RoomsActions } from './rooms.actions';

export function roomsReducer(state: Rooms, action: RoomsActions) {
    switch (action.type) {
        case GET_ROOMS:
            return {
                ...state,
                loading: true,
            };

        case GET_ROOMS_SUCCESS:
            return {
                ...state,
                items: action.payload,
                loading: false,
            };

        default:
            return state;
    }
}
