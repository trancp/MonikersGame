import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GET_ROOMS, GetRoomsSuccess } from './rooms.actions';

import { Observable } from 'rxjs/Observable';

import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';

import capitalize from 'lodash-es/capitalize';

const WORDS = [];

@Injectable()
export class RoomsEffects {

    constructor(private actions: Actions,
                private db: AngularFireDatabase) {
    }

    @Effect()
    getRooms: Observable<Action> = this.actions.ofType(GET_ROOMS)
        .pipe(
            mergeMap(() => this._getRooms()),
            map((rooms: any) => GetRoomsSuccess(rooms)),
        );

    private _getRooms(): FirebaseListObservable<any> {
        return this.db.list('/rooms');
    }

    public submitMonikerWords() {
        WORDS.map((word: string) => {
            const wordToPush = word.split(' ').map((o: string) => capitalize(o)).join(' ');
            this.db.list('/words/monikers').push(wordToPush);
        });
    }
}
