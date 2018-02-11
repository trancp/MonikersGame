import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter as rxjsFilter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';

import { RoomService } from '../../room/room.service';
import { PlayerService } from '../../player/player.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { Room } from '../../interfaces/room.model';
import { Player } from '../../interfaces/player.model';
import { AppState } from '../../app.state';

import concat from 'lodash-es/concat';
import flatten from 'lodash-es/flatten';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import keys from 'lodash-es/keys';
import map from 'lodash-es/map';
import pickBy from 'lodash-es/pickBy';
import shuffle from 'lodash-es/shuffle';
import slice from 'lodash-es/slice';
import zip from 'lodash-es/zip';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    roomState: Observable<Room>;
    playerState: Observable<Player>;
    stopTime: string;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private store: Store<AppState>,
                private roomService: RoomService,
                private playerService: PlayerService) {
        this.route.paramMap
            .subscribe((params: ParamMap) => {
                const code = params.get('code');
                const name = params.get('name');
                this.roomService.dispatchGetRoom(code);
                this.playerService.dispatchGetPlayer(name);
                this.roomState = this.store.select('room');
                this.playerState = this.store.select('player');
                this.routeGuardService.checkExistingUser();
            });
        this.playerState.pipe(
            rxjsFilter((playerState: Player) => !isEmpty(playerState) && !playerState.ready && !playerState.loading),
            take(1),
            tap(() => this.playerService.dispatchUpdatePlayer({ ready: true })),
        ).subscribe();
    }

    ngOnInit() {
        this.routeGuardService.goToGameOverViewOnGameOverStatus();
    }

    public startTimer(isTurn: boolean): void {
        if (!isTurn) {
            return;
        }
        const stopTime = new Date();
        stopTime.setMinutes(stopTime.getMinutes() + 1);
        this.stopTime = stopTime.toString();
        this.roomService.dispatchUpdateRoom({ timer: this.stopTime });
    }

    public onTimerEnd(user: Player, room: Room): void {
        const isTurn = isEqual(user.id, get(room.turnOrder, `[${room.turn}].id`));
        if (!isTurn) {
            return;
        }
        this.handleNextTurn(room);
    }

    public skip(wordIndex: number, remainingWords: string[]): void {
        const incrementedWordIndex = (wordIndex + 1) > (remainingWords.length - 1)
            ? 0
            : wordIndex + 1;
        this.roomService.dispatchUpdateRoom({ word: incrementedWordIndex });
    }

    public score(wordIndex: number, room: Room): void {
        const teams = map(room.teams, (team: any) => {
            if (team.isTurn) {
                team.words = concat(get(team, 'words', []), [get(room, `words[${wordIndex}]`)]);
                return team;
            }
            return team;
        });
        const remainingWords = room.words;
        const startSlice = slice(remainingWords, 0, wordIndex);
        const endSlice = slice(remainingWords, wordIndex + 1, remainingWords.length);
        const updatedWordsList = concat(startSlice, endSlice);
        const incrementedWordIndex = isEqual(wordIndex, (remainingWords.length - 1))
            ? 0
            : wordIndex;
        const isGameOver = isEqual(3, room.round) && !updatedWordsList.length;
        const update = {
            teams,
            gameOver: isGameOver,
            word: incrementedWordIndex,
            words: updatedWordsList,
        };
        this.roomService.dispatchUpdateRoom(update);
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
        const update = {
            round: !isGameOver && isRoundOver ? room.round + 1 : room.round,
            gameOver: isGameOver,
            teams: isRoundOver ? setTeamForNewRound : updatedTeams,
            timer: '',
            turn: isRoundOver ? 0 : room.turn + 1,
            turnOrder: isRoundOver ? this.initTurnOrderForNewRound(room.players, nextTeamToStart) : room.turnOrder,
            words: isRoundOver ? this.roomService.compileShuffledRoomWords(room.players) : shuffle(room.words),
        };
        this.roomService.dispatchUpdateRoom(update);
    }

    private initTurnOrderForNewRound(players: Player[], teamToStart: number) {
        const readyPlayers = pickBy(players, (player: Player) => player.ready);
        const sortPlayersByStartingTeam = this.roomService.sortPlayersByStartingTeam(readyPlayers, teamToStart);
        const shuffledReadyPlayers = map(sortPlayersByStartingTeam, (team: Player[]) => shuffle(team));
        return flatten(zip(...shuffledReadyPlayers));
    }

    public calculateRemainingWordsProgress(room: Room) {
        return (get(room, 'words.length', 0) / (keys(get(room, 'players', [])).length * 5)) * 100;
    }
}