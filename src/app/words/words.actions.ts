import {Action} from '@ngrx/store';

export const GET_WORDS = '[words] GET';
export const GET_WORDS_SUCCESS = '[words] GET SUCCESS';

export class WordsActions implements Action {
    constructor(public type: string = '', public payload: any = {}) {
    }
}

export function GetWords(payload?: any): WordsActions {
    return new WordsActions(GET_WORDS, payload);
}

export function GetWordsSuccess(payload: any): WordsActions {
    return new WordsActions(GET_WORDS_SUCCESS, payload);
}
