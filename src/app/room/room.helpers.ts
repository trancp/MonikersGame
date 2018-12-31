import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';

import capitalize from 'lodash-es/capitalize';
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
    'Z',
];
const CODE_LENGTH = 4;
const MAX_NUM_ROOMS = Math.pow(CODE_LENGTH, CODE_CHARACTERS.length);

function generateRandomRoomCode(): string {
    return CODE_CHARACTERS[random(0, CODE_CHARACTERS.length - 1)];
}

function buildNewRoomCode(existingCodes: string[]): string {
    const code = map(new Array(CODE_LENGTH), () => generateRandomRoomCode()).join('');
    return includes(existingCodes, code)
        ? buildNewRoomCode(existingCodes)
        : code;
}

export function findNewRoomCode(rooms: Room[]): string {
    const existingCodes = map(rooms, (room: any) => room.code);
    const noAvailableRooms = existingCodes.length >= MAX_NUM_ROOMS;
    return noAvailableRooms
        ? ''
        : buildNewRoomCode(existingCodes);
}

export function initializeGame(room: Room): any {
    const words = sanitizeWords(compileShuffledRoomWords(room.players));
    const startingTeam = random(0, 1);
    const teams = [
        {
            name: 'Team 1',
            teamId: 1,
            isTurn: false,
            words: [],
        },
        {
            name: 'Team 2',
            teamId: 2,
            isTurn: false,
            words: [],
        },
    ];
    const teamList = sortPlayersByStartingTeam(room.players, startingTeam + 1);
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
        word: 0,
    };
}

function sanitizeWords(words: string[]): string[] {
    return words.map((word: string) => {
        const wordSplitBySpace = word.split(' ');
        return wordSplitBySpace.map((wordInSplit: string) => capitalize(wordInSplit)).join(' ');
    });
}

export function compileShuffledRoomWords(players: Player[]): string[] {
    return shuffle(flatten(map(players, (player: Player) => player.words)));
}

export function sortPlayersByStartingTeam(players: Player[], startingTeam: number) {
    return reduce(players, (accumulator: any[], player: Player, id: string) => {
        if (startingTeam === player.team) {
            accumulator[0].push({...player, id});
        } else {
            accumulator[1].push({...player, id});
        }
        return accumulator;
    }, [[], []]);
}

export function initializeRoomForGame(room: Room) {
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
                words: [],
            };
        }),
    };
}
