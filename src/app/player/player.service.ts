import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { buildPlayerSlug, getAvailableTeam, getPlayerIndexForTeam, getPlayerKey, VALID_UPDATE_KEYS} from './player.helpers';
import { Room } from '../interfaces/room.model';
import { Player } from '../interfaces/player.model';

import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import pick from 'lodash-es/pick';
import values from 'lodash-es/values';

@Injectable()
export class PlayerService {

    constructor(private db: AngularFireDatabase) {
    }

    getPlayerByName(room: Room, slug: string) {
        const playerKey = getPlayerKey(room.players, buildPlayerSlug(slug));
        if (!playerKey) {
            return throwError('Invalid User');
        }
        const url = `/rooms/${room.pushKey}/players/${playerKey}`;
        return this.db.object(url)
            .pipe(
                map((player: any) => {
                    return {
                        ...player,
                        pushKey: url,
                        id: playerKey,
                        loading: false,
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
            slug: buildPlayerSlug(name),
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

    updatePlayerProperties(player: Player, update: any) {
        return this.db
            .object(player.pushKey)
            .update(pick(update, VALID_UPDATE_KEYS));
    }
}
