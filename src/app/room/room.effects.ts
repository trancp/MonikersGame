import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';

import { RoomService } from './room.service';
import {
    INIT_ROOM_TYPE,
    START_GAME_TYPE,
    UPDATE_ROOM,
    UpdateRoomSuccess,
} from './room.actions';
import { AppState } from '../app.state';
import { DEFAULT_ROOM_PROPERTIES } from '../interfaces/room.model';
import { initializeGame, initializeRoomForGame } from './room.helpers';

import includes from 'lodash-es/includes';
import upperCase from 'lodash-es/upperCase';

@Injectable()
export class RoomEffects {
    constructor(private actions: Actions,
                private db: AngularFireDatabase,
                private roomService: RoomService,
                private store: Store<AppState>) {
    }

    @Effect()
    updateRoom: Observable<Action> = this.actions.ofType(UPDATE_ROOM)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('room').pipe(
                    filter((room: any) => room.code),
                    take(1),
                    map((room: any) => {
                        return {
                            url: `/rooms/${room.pushKey}`,
                            update: action.payload,
                        };
                    }),
                );
            }),
            mergeMap(({ url, update }: { url: string, update: any }) => this._updateRoom(url, update)),
            map((room: any) => UpdateRoomSuccess(room)),
        );

    @Effect()
    startGame: Observable<Action> = this.actions.ofType(START_GAME_TYPE)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('room').pipe(
                    filter((room: any) => room.code),
                    take(1),
                    map((room: any) => {
                        const url = `/rooms/${room.pushKey}`;
                        if (!action.payload.user.vip) {
                            return {
                                url,
                                update: {},
                            };
                        }
                        return {
                            url,
                            update: initializeGame(room),
                        };
                    }),
                    mergeMap(({ url, update }: { url: string, update: any }) => {
                        this.addToGlobalWordBank(update.words, action.payload.globalWordBank);
                        return this._updateRoom(url, update);
                    }),
                );
            }),
            map((room: any) => UpdateRoomSuccess(room)),
        );

    @Effect()
    initializeRoom: Observable<Action> = this.actions.ofType(INIT_ROOM_TYPE)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('room').pipe(
                    filter((room: any) => room.code),
                    take(1),
                    map((room: any) => {
                        const url = `/rooms/${room.pushKey}`;
                        return {
                            url,
                            update: initializeRoomForGame(room),
                        };
                    }),
                );
            }),
            mergeMap(({ url, update }: { url: string, update: any }) => this._updateRoom(url, update)),
            map((room: any) => UpdateRoomSuccess(room)),
        );

    private _findRoomByCode(code: string) {
        return this.db.list('/rooms', {
            query: {
                orderByChild: 'code',
                equalTo: upperCase(code),
            },
        });
    }

    private _updateRoom(url: string, update: any) {
        return this.db
            .object(url)
            .update(update)
            .then(() => update);
    }

    private addToGlobalWordBank(roomWords: string[], globalWordBank: string[]) {
        const wordsToPush = roomWords.filter((word: string) => !includes(globalWordBank, word));
        wordsToPush.map((word: string) => {
            return this.db
                .list('/words/custom')
                .push(word);
        });
    }
}
