import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { RoomService } from '../../room/room.service';
import { PlayerService } from '../../player/player.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { Room } from '../../interfaces/room.model';
import { Player } from '../../interfaces/player.model';
import { compileShuffledRoomWords, sortPlayersByStartingTeam } from '../../room/room.helpers';

import concat from 'lodash-es/concat';
import flatten from 'lodash-es/flatten';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import pickBy from 'lodash-es/pickBy';
import shuffle from 'lodash-es/shuffle';
import zip from 'lodash-es/zip';

const roundText = {
    1: `Round 1: Say Anything You Want,${'<br>'}But The Word.`,
    2: 'Round 2: One Word.',
    3: 'Round 3: Charades. No Words.',
};

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit, OnDestroy {
    roomState: BehaviorSubject<Room> = new BehaviorSubject({ loading: true });
    playerState: BehaviorSubject<Player> = new BehaviorSubject({ loading: true });
    stopTime: string;
    componentDestroy = new Subject();
    roundText: string;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private roomService: RoomService,
                private playerService: PlayerService) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roundText = get(roundText, room.round);
                    this.roomState.next(room);
                    this.playerService.getPlayerByName(room, slug)
                        .pipe(
                            takeUntil(this.componentDestroy),
                            tap((player: Player) => {
                                this.playerState.next(player);
                            }),
                        )
                        .subscribe();
                }),
            )
            .subscribe();
        this.routeGuardService.goToGameOverViewOnGameOverStatus(this.roomState, this.playerState);
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    public startTimer(room: Room): void {
        const stopTime = new Date();
        stopTime.setMinutes(stopTime.getMinutes() + 1);
        this.stopTime = stopTime.toISOString();
        this.roomService.updateRoomProperties(room, { timer: this.stopTime });
    }

    public onTimerEnd(user: Player, room: Room): void {
        const isTurn = isEqual(user.id, get(room.turnOrder, `[${room.turn}].id`));
        if (!isTurn) {
            return;
        }
        this.handleNextTurn(room);
    }

    public skip(room: Room, wordIndex: number, remainingWords: string[]): void {
        const incrementedWordIndex = (wordIndex + 1) > (remainingWords.length - 1)
            ? 0
            : wordIndex + 1;
        this.roomService.updateRoomProperties(room, { word: incrementedWordIndex });
    }

    public score(wordIndex: number, room: Room): void {
        const teams = map(room.teams, (team: any) => {
            if (team.isTurn) {
                team.words = concat(get(team, 'words', []), [get(room, `words[${wordIndex}]`)]);
                return team;
            }
            return team;
        });
        const updatedWordsList = room.words.filter((word: string, index: number) => !isEqual(wordIndex, index));
        const incrementedWordIndex = isEqual(wordIndex, (room.words.length - 1))
            ? 0
            : wordIndex;
        const isGameOver = isEqual(3, room.round) && !updatedWordsList.length;
        const update = {
            teams,
            gameOver: isGameOver,
            word: incrementedWordIndex,
            words: updatedWordsList,
        };
        this.roomService.updateRoomProperties(room, update);
    }

    private handleNextTurn(room: Room) {
        const lastPlayerDone = (room.turn + 1) > (room.turnOrder.length - 1);
        const noMoreWords = isEmpty(room.words);
        const isRoundOver = lastPlayerDone || noMoreWords;
        const updatedTeams = map(room.teams, (team: any) => {
            return {
                ...team,
                isTurn: !team.isTurn,
            };
        });
        const otherTeam = room.teamToStart === 1 ? 2 : 1;
        const nextTeamToStart = isEqual((room.round + 1) % 2, 0) ? otherTeam : room.teamToStart;
        const setTeamForNewRound = map(room.teams, (team: any) => {
            return {
                ...team,
                isTurn: team.teamId === nextTeamToStart,
            };
        });
        const isGameOver = isEqual(3, room.round) && lastPlayerDone;
        const readyPlayers = pickBy(room.players, (player: Player) => player.ready);
        const update = {
            round: !isGameOver && isRoundOver ? room.round + 1 : room.round,
            gameOver: isGameOver,
            teams: isRoundOver ? setTeamForNewRound : updatedTeams,
            timer: '',
            turn: isRoundOver ? 0 : room.turn + 1,
            turnOrder: isRoundOver ? this.initTurnOrderForNewRound(readyPlayers, nextTeamToStart) : room.turnOrder,
            words: isRoundOver ? compileShuffledRoomWords(readyPlayers) : shuffle(room.words),
        };
        this.roomService.updateRoomProperties(room, update);
    }

    private initTurnOrderForNewRound(players: Player[], teamToStart: number) {
        const playersSortedByStartingTeam = sortPlayersByStartingTeam(players, teamToStart);
        const shuffledReadyPlayers = map(playersSortedByStartingTeam, (team: Player[]) => shuffle(team));
        return flatten(zip(...shuffledReadyPlayers));
    }

    public calculateRemainingWordsProgress(room: Room) {
        return (get(room, 'words.length', 0) / room.numOfWords) * 100;
    }
}
