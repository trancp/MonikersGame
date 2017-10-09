import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
    CreateRoom,
    GetRoom,
    UpdateRoom,
    StartGame,
    ResetRoom,
    InitRoom
} from './room.actions';

import { AppState } from '../app.state';
import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';
import { Rooms } from '../interfaces/rooms.model';

import flatten from 'lodash-es/flatten';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import mapValues from 'lodash-es/mapValues';
import random from 'lodash-es/random';
import reduce from 'lodash-es/reduce';
import shuffle from 'lodash-es/shuffle';
import zip from 'lodash-es/zip';

const CODE_CHARACTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
];
const CODE_LENGTH = 4;
const MAX_NUM_ROOMS = Math.pow(CODE_LENGTH, CODE_CHARACTERS.length);

@Injectable()
export class RoomService {

    constructor(private store: Store<AppState>) {
    }

    public findNewRoomCode(rooms: Rooms): string {
        const existingCodes = map(rooms, (room: any) => room.code);
        const noAvailableRooms = existingCodes.length >= MAX_NUM_ROOMS;
        return noAvailableRooms
            ? ''
            : this._newRoomCode(existingCodes);
    }

    private _newRoomCode(existingCodes: string[]): string {
        const code = map(new Array(CODE_LENGTH), () => this._generateRandomRoomCode()).join('');
        return includes(existingCodes, code)
            ? this._newRoomCode(existingCodes)
            : code;
    }

    private _generateRandomRoomCode(): string {
        return CODE_CHARACTERS[random(0, CODE_CHARACTERS.length - 1)];
    }

    public initializeGame(room: Room): any {
        const words = this.compileShuffledRoomWords(room.players);
        const startingTeam = random(0, 1);
        const teams = [
            {
                name: 'Team 1',
                teamId: 1,
                isTurn: false,
                words: []
            },
            {
                name: 'Team 2',
                teamId: 2,
                isTurn: false,
                words: []
            }
        ];
        const teamList = this.sortPlayersByStartingTeam(room.players, startingTeam + 1);
        const turnOrder = flatten(zip(...map(teamList, (team: any) => shuffle(team))));
        teams[startingTeam].isTurn = true;
        return {
            words,
            teams,
            turnOrder,
            numOfWords: words.length,
            started: true,
            round: 1,
            turn: 0,
            teamToStart: startingTeam + 1,
            word: 0
        };
    }

    public compileShuffledRoomWords(players: Player[]): string[] {
        return shuffle(flatten(map(players, (player: Player) => player.words)));
    }

    public sortPlayersByStartingTeam(players: Player[], startingTeam: number) {
        return reduce(players, (accumulator: any[], player: Player, id: string) => {
            if (startingTeam === player.team) {
                accumulator[0].push({...player, id});
            } else {
                accumulator[1].push({...player, id});
            }
            return accumulator;
        }, [[], []]);
    }

    public initializeRoom(room: Room) {
        return {
            code: room.code,
            gameOver: false,
            round: 1,
            started: false,
            teams: [],
            timer: '',
            turnOrder: [],
            words: [],
            word: 0,
            players: mapValues(room.players, (player: Player) => {
                return {
                    ...player,
                    ready: false,
                    words: []
                };
            })
        };
    }

    public dispatchGetRoom(code: string): void {
        this.store.dispatch(GetRoom(code));
    }

    public dispatchCreateRoom(code: string): void {
        this.store.dispatch(CreateRoom(code));
    }

    public dispatchUpdateRoom(update: any): void {
        this.store.dispatch(UpdateRoom(update));
    }

    public dispatchStartGame(player: Player): void {
        this.store.dispatch(StartGame(player));
    }

    public dispatchResetRoom(): void {
        this.store.dispatch(ResetRoom());
    }

    public dispatchInitializeRoom(): void {
        this.store.dispatch(InitRoom());
    }
}
