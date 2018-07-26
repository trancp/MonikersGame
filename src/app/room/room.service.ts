import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { CreateRoom, GetRoom, InitRoom, ResetRoom, StartGame, UpdateRoom, } from './room.actions';

import { AppState } from '../app.state';
import { Player } from '../interfaces/player.model';

import upperCase from 'lodash-es/upperCase';

@Injectable()
export class RoomService {

    constructor(private db: AngularFireDatabase,
                private store: Store<AppState>) {
    }

    getRoomByCode(code: string) {
        return this.db
            .list('/rooms', {
                query: {
                    orderByChild: 'code',
                    equalTo: upperCase(code),
                },
            })
            .pipe(
                map(([room]: any) => {
                    return {
                        ...room,
                        words: room.words || [],
                        pushKey: room.$key,
                    };
                }),
            );
    }

    public dispatchCreateRoom(code: string): void {
        this.store.dispatch(CreateRoom(code));
    }

    public dispatchUpdateRoom(update: any): void {
        this.store.dispatch(UpdateRoom(update));
    }

    public dispatchStartGame(payload: { user: Player, globalWordBank: string[] }): void {
        this.store.dispatch(StartGame(payload));
    }

    public dispatchResetRoom(): void {
        this.store.dispatch(ResetRoom());
    }

    public dispatchInitializeRoom(): void {
        this.store.dispatch(InitRoom());
    }
}
