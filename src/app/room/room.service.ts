import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { filter, map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_ROOM_PROPERTIES, Room } from '../interfaces/room.model';
import { initializeGame, initializeRoomForGame } from './room.helpers';
import { Player } from '../interfaces/player.model';

import includes from 'lodash-es/includes';
import upperCase from 'lodash-es/upperCase';

@Injectable()
export class RoomService {

    constructor(private db: AngularFireDatabase,
                private router: Router) {
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
                map(([room = {}]: any) => {
                    return {
                        ...room,
                        words: room.words || [],
                        pushKey: room.$key,
                        loading: false,
                    };
                }),
            );
    }

    createRoom(code: string) {
        return this.db
            .list('/rooms')
            .push({
                code,
                created_at: new Date().toString(),
                ...DEFAULT_ROOM_PROPERTIES,
            })
            .then((roomRef: any) => {
                return {
                    code,
                    pushKey: roomRef.key,
                };
            });
    }

    removePlayerFromRoom(room: Room, player: Player) {
        const url = `/rooms/${room.pushKey}/players/${player.id}`;
        return this.db.object(url).remove();
    }

    initializeRoom(room: Room) {
        const url = `/rooms/${room.pushKey}`;
        return this.updateRoom(url, initializeRoomForGame(room));
    }

    updateRoom(url: string, update: any) {
        return this.db
            .object(url)
            .update(update)
            .then(() => update);
    }

    startGame(room: Room) {
        const url = `/rooms/${room.pushKey}`;
        return this.updateRoom(url, initializeGame(room));
    }

    updateRoomProperties(room: Room, update: any) {
        const url = `/rooms/${room.pushKey}`;
        return this.updateRoom(url, update);
    }

    addToGlobalWordBank(roomWords: string[], globalWordBank: string[]) {
        const wordsToPush = roomWords.filter((word: string) => !includes(globalWordBank, word));
        wordsToPush.map((word: string) => {
            return this.db
                .list('/words/custom')
                .push(word);
        });
    }

    goToGameViewOnGameStarted(roomState: BehaviorSubject<Room>, slug) {
        return roomState.pipe(
            filter((room: Room) => room.started),
            take(1),
            tap((room: Room) => this.router.navigate([room.code, slug, 'game'])),
        );
    }
}
