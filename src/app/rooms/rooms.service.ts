import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { GetRooms } from './rooms.actions';

import { AppState } from '../app.state';

import { Room } from '../interfaces/room.model';
import { Rooms } from '../interfaces/rooms.model';

import find from 'lodash-es/find';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import upperCase from 'lodash-es/upperCase';

@Injectable()
export class RoomsService {

    constructor(private store: Store<AppState>) {
    }

    public dispatchGetRooms(): void {
        this.store.dispatch(GetRooms());
    }

    public roomExists(rooms: Rooms, code: string): boolean {
        const foundRoom = find(rooms, (room: Room) => isEqual(room.code, upperCase(code)));
        return !isEmpty(foundRoom);
    }
}
