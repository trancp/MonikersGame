import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {AngularFireDatabase} from 'angularfire2/database';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {Action, Store} from '@ngrx/store';

import {PlayerService} from './player.service';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

import {filter} from 'rxjs/operators/filter';
import {map as rxjsMap} from 'rxjs/operators/map';
import {mergeMap} from 'rxjs/operators/mergeMap';
import {take} from 'rxjs/operators/take';
import {catchError} from 'rxjs/operators/catchError';

import {
    GET_PLAYER,
    GetPlayerSuccess,
    CREATE_PLAYER,
    CreatePlayerSuccess,
    UPDATE_PLAYER,
    UpdatePlayerSuccess,
    UpdatePlayerFail
} from './player.actions';

import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import pick from 'lodash-es/pick';

import {AppState} from '../app.state';

const VALID_UPDATE_KEYS = ['name', 'ready', 'team', 'teamPlayerIndex', 'vip', 'words'];

@Injectable()
export class PlayerEffects {
    constructor(private actions: Actions,
                private db: AngularFireDatabase,
                private playerService: PlayerService,
                private store: Store<AppState>) {
    }

    @Effect()
    getPlayer: Observable<Action> = this.actions.ofType(GET_PLAYER)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('room').pipe(
                    filter((room: any) => room.code),
                    take(1),
                    rxjsMap((room: any) => {
                        const playerKey = this.playerService.getPlayerKey(room.players, action.payload);
                        const url = `/rooms/${room.pushKey}/players/${playerKey}`;
                        this.playerService.dispatchSetPlayer({pushKey: url, id: playerKey});
                        return url;
                    })
                );
            }),
            mergeMap((url: string) => this._getPlayer(url)),
            rxjsMap((player: any) => GetPlayerSuccess(player))
        );

    @Effect()
    createPlayer: Observable<Action> = this.actions.ofType(CREATE_PLAYER)
        .pipe(
            mergeMap((action: any) => {
                return this.store.select('room').pipe(
                    filter((room: any) => room.code),
                    take(1),
                    rxjsMap((room: any) => {
                        const teamToJoin = this.playerService.getAvailableTeam(room);
                        const playersLength = get(map(room.players, (player: any) => player), 'length', 0);
                        const isVip = isEqual(0, playersLength);
                        return {
                            url: `/rooms/${room.pushKey}/players`,
                            player: {
                                name: action.payload,
                                ready: false,
                                teamPlayerIndex: this.playerService.getPlayerIndexForTeam(teamToJoin, room.players),
                                team: teamToJoin,
                                vip: isVip,
                                words: []
                            }
                        };
                    })
                );
            }),
            mergeMap(({url, player}: { url: string, player: any }) => this._createPlayer(url, player)),
            rxjsMap((player: any) => CreatePlayerSuccess(player))
        );

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
                            update: action.payload
                        };
                    })
                );
            }),
            mergeMap(({url, update}: { url: string, update: any }) => this._updatePlayer(url, update)),
            rxjsMap((player: any) => UpdatePlayerSuccess(player)),
            catchError((err: any) => of(UpdatePlayerFail()))
        );

    private _getPlayer(url): FirebaseObjectObservable<any> {
        return this.db.object(url);
    }

    private _updatePlayer(url: string, update: any): any {
        return this.db
            .object(url)
            .update(pick(update, VALID_UPDATE_KEYS));
    }

    private _createPlayer(url: string, player: any) {
        return this.db
            .list(url)
            .push(player)
            .then(playerRef => {
                return {
                    ...player,
                    id: playerRef.key,
                    pushKey: `${url}/${playerRef.key}`
                };
            });
    }
}
