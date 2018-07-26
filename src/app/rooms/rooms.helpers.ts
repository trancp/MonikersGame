import { Room } from '../interfaces/room.model';

import find from 'lodash-es/find';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import upperCase from 'lodash-es/upperCase';

export function roomExists(rooms: Room[], code: string): boolean {
    const foundRoom = find(rooms, (room: Room) => isEqual(room.code, upperCase(code)));
    return !isEmpty(foundRoom);
}
