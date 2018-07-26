import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { UpdatePlayer } from './player.actions';

import { AppState } from '../app.state';
import { getAvailableTeam, getPlayerIndexForTeam, getPlayerKey } from './player.helpers';
import { Room } from '../interfaces/room.model';

import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import values from 'lodash-es/values';

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

    createPlayer(room: Room, name: string) {
        const roomPlayers = values(get(room, 'players', []));
        const teamToJoin = getAvailableTeam(room);
        const playersLength = get(roomPlayers, 'length', 0);
        const isVip = isEqual(0, playersLength);
        const url = `/rooms/${room.pushKey}/players`;
        const player = {
            name,
            ready: false,
            teamPlayerIndex: getPlayerIndexForTeam(teamToJoin, room.players),
            team: teamToJoin,
            vip: isVip,
            words: [],
        };
        return this.db
            .list(url)
            .push(player)
            .then((playerRef: any) => {
                return {
                    ...player,
                    id: playerRef.key,
                    pushKey: `${url}/${playerRef.key}`,
                };
            });
    }

    public dispatchUpdatePlayer(update: any): void {
        this.store.dispatch(UpdatePlayer(update));
    }
}
