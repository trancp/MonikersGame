import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GET_WORDS, GetWordsSuccess, } from './words.actions';

import { Observable } from 'rxjs';

import { map, mergeMap } from 'rxjs/operators';

import mapKeys from 'lodash-es/mapKeys';
import mapValues from 'lodash-es/mapValues';
import values from 'lodash-es/values';

import { MONIKERS_WORD_BANK } from './words.helper';

@Injectable()
export class WordsEffects {

    constructor(private actions: Actions,
                private db: AngularFireDatabase) {
    }

    @Effect()
    getWords: Observable<Action> = this.actions.ofType(GET_WORDS)
        .pipe(
            mergeMap(() => this.getGameWords()),
            map((words: any) => {
                const mapWordsToKeys = mapKeys(words, (wordsState: any) => wordsState.$key);
                const sanitizedWordsValues = mapValues(mapWordsToKeys, (wordsState: any) => values(wordsState));
                return GetWordsSuccess({ ...sanitizedWordsValues, monikers: MONIKERS_WORD_BANK });
            }),
        );

    private getGameWords(): FirebaseListObservable<any> {
        return this.db.list('/words');
    }
}
