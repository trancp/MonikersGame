import {
    PlayerActions,
    UPDATE_PLAYER,
    UPDATE_PLAYER_FAIL,
    UPDATE_PLAYER_SUCCESS,
} from './player.actions';
import { Player } from '../interfaces/player.model';

export function playerReducer(playerState: Player, action: PlayerActions) {
    switch (action.type) {

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
        default:
            return playerState;
    }

}
