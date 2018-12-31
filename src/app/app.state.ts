import { Room } from './interfaces/room.model';
import { Player } from './interfaces/player.model';
import { WordsState } from './interfaces/words.interfaces';

export interface AppState {
    rooms: Room[];
    room: Room;
    player: Player;
    words: WordsState;
}
