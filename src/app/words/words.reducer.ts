import { WordsActions } from './words.actions';

import {
    GET_WORDS_SUCCESS,
} from './words.actions';

import { WordsState } from '../interfaces/words.interfaces';

const INITIAL_STATE: WordsState  = {
    custom: [],
    monikers: [],
    isLoaded: false,
};

export function wordsReducer(state: any = INITIAL_STATE, action: WordsActions) {
    switch (action.type) {

        case GET_WORDS_SUCCESS:
            return {
                custom: [...action.payload.custom],
                monikers: [...action.payload.monikers],
                isLoaded: true,
            };

        default:
            return state;
    }
}
