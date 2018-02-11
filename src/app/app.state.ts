import { Room } from './interfaces/room.model';
import { Rooms } from './interfaces/rooms.model';
import { Player } from './interfaces/player.model';
import { WordsState } from './interfaces/words.interfaces';

export interface AppState {
    rooms: Rooms;
    room: Room;
    player: Player;
    words: WordsState;
}
