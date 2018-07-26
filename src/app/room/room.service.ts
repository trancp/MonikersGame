import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { UpdateRoom, } from './room.actions';

import { AppState } from '../app.state';
import { DEFAULT_ROOM_PROPERTIES, Room } from '../interfaces/room.model';
import { initializeGame, initializeRoomForGame } from './room.helpers';

import includes from 'lodash-es/includes';
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

    dispatchUpdateRoom(update: any): void {
        this.store.dispatch(UpdateRoom(update));
    }

    addToGlobalWordBank(roomWords: string[], globalWordBank: string[]) {
        const wordsToPush = roomWords.filter((word: string) => !includes(globalWordBank, word));
        wordsToPush.map((word: string) => {
            return this.db
                .list('/words/custom')
                .push(word);
        });
    }
}
