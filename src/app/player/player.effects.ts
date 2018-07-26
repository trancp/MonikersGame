import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFireDatabase } from 'angularfire2/database';
import { Action, Store } from '@ngrx/store';

import { PlayerService } from './player.service';

import { Observable, of } from 'rxjs';

import { catchError, filter, map as rxjsMap, mergeMap, take } from 'rxjs/operators';

import {
    UPDATE_PLAYER,
    UpdatePlayerFail,
    UpdatePlayerSuccess,
} from './player.actions';

import pick from 'lodash-es/pick';

import { AppState } from '../app.state';

const VALID_UPDATE_KEYS = ['name', 'ready', 'team', 'teamPlayerIndex', 'vip', 'words'];

@Injectable()
export class PlayerEffects {
    constructor(private actions: Actions,
                private db: AngularFireDatabase,
                private playerService: PlayerService,
                private store: Store<AppState>) {
    }

    @Effect()
    updatePlayer: Observable<Action> = this.actions.ofType(UPDATE_PLAYER)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('player').pipe(
                    filter((player: any) => player.pushKey),
                    take(1),
                    rxjsMap((player: any) => {
                        return {
                            url: player.pushKey,
                            update: action.payload,
                        };
                    }),
                );
            }),
            mergeMap(({url, update}: { url: string, update: any }) => this._updatePlayer(url, update)),
            rxjsMap((player: any) => UpdatePlayerSuccess(player)),
            catchError((err: any) => of(UpdatePlayerFail())),
        );

    private _updatePlayer(url: string, update: any): any {
        return this.db
            .object(url)
            .update(pick(update, VALID_UPDATE_KEYS));
    }
}
