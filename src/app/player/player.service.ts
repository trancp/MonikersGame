import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { CreatePlayer, UpdatePlayer } from './player.actions';

import { AppState } from '../app.state';
import { getPlayerKey } from './player.helpers';
import { Room } from '../interfaces/room.model';

@Injectable()
export class PlayerService {

    constructor(private db: AngularFireDatabase,
                private store: Store<AppState>) {
    }

    getPlayerByName(room: Room, name: string) {
        const playerKey = getPlayerKey(room.players, name);
        const url = `/rooms/${room.pushKey}/players/${playerKey}`;
        return this.db.object(url)
            .pipe(
                map((player: any) => {
                    return {
                        ...player,
                        pushKey: url,
                        id: playerKey,
                    };
                }),
            );
    }

    public dispatchUpdatePlayer(update: any): void {
        this.store.dispatch(UpdatePlayer(update));
    }

    public dispatchCreatePlayer(name: string): void {
        this.store.dispatch(CreatePlayer(name));
    }
}
