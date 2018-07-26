import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';

import { RoomService } from './room.service';
import {
    UPDATE_ROOM,
    UpdateRoomSuccess,
} from './room.actions';
import { AppState } from '../app.state';

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

    private _updateRoom(url: string, update: any) {
        return this.db
            .object(url)
            .update(update)
            .then(() => update);
    }
}
