import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter as rxjsFilter, map as rxjsMap, mergeMap, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { WordsService } from '../../words/words.service';

import { RoomService } from '../room.service';
import { PlayerService } from '../../player/player.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { DialogRulesComponent } from '../../dialog/dialog-rules/dialog-rules.component';


import { Room } from '../../interfaces/room.model';
import { Player } from '../../interfaces/player.model';
import { AppState } from '../../app.state';
import { DataTransfer } from '../../interfaces/data-transfer.model';

import every from 'lodash-es/every';
import filter from 'lodash-es/filter';
import findIndex from 'lodash-es/findIndex';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import reduce from 'lodash-es/reduce';
import slice from 'lodash-es/slice';

interface ImovingPlayer {
    player: Player;
    listIndex: number;
    newTeam?: number;
}

@Component({
    selector: 'app-room-view',
    templateUrl: './room-view.component.html',
    styleUrls: ['./room-view.component.scss'],
})
export class RoomViewComponent implements OnInit {
    isJoiningGame: boolean;
    roomState: Observable<Room>;
    playerState: Observable<Player>;
    dataToTransfer: DataTransfer;
    GLOBAL_WORD_BANK: string[];
    isLoading = false;

    constructor(private dialog: MatDialog,
                private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private router: Router,
                private store: Store<AppState>,
                private roomService: RoomService,
                private playerService: PlayerService,
                private wordsService: WordsService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.route.paramMap
            .subscribe((params: ParamMap) => {
                const name = params.get('name');
                this.playerService.dispatchGetPlayer(name);
                this.playerState = this.store.select('player');
                this.routeGuardService.checkExistingUser();
                this.goToGameViewOnGameStarted(name);
            });
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap(() => {
                   this.isLoading = false;
                }),
            );
        this.playerService.dispatchUpdatePlayer({ ready: true });
        this.isJoiningGame = isEqual('join', get(this.route, 'url.value[0].path'));
        this.wordsService.getAllWordsFromDb()
            .pipe(
                rxjsMap((words: string[]) => {
                    this.GLOBAL_WORD_BANK = words;
                }),
            ).subscribe();
    }

    public goBack(code: string): void {
        const backState = this.isJoiningGame
            ? `/join/${code}`
            : '/create';
        this.router.navigate([backState]);
    }

    public goToGame(room: any, user: Player): void {
        if (!this.roomIsReadyToStart(room)) {
            return;
        }
        this.roomService.dispatchStartGame({ user, globalWordBank: this.GLOBAL_WORD_BANK });
        this.router.navigate(['game', room.code, user.name]);
    }

    public goToGameViewOnGameStarted(name: string) {
        this.roomState.pipe(
            rxjsFilter((room: Room) => room.started),
            take(1),
            tap((room: Room) => this.router.navigate(['game', room.code, name])),
        ).subscribe();
    }

    public switchPlayerToNewTeam(movingPlayerParams: ImovingPlayer, room: any): void {
        const movingPlayer = {
            ...movingPlayerParams.player,
            team: movingPlayerParams.newTeam,
        };
        const playersWithoutMovingPlayer = filter(room.players, (player: any) => !isEqual(player.name, movingPlayer.name));
        const playersWithIndexing = map(playersWithoutMovingPlayer, (player: any) => player);
        const teamOnePlayers = this.playerService.getTeamPlayers(playersWithIndexing, 1);
        const teamTwoPlayers = this.playerService.getTeamPlayers(playersWithIndexing, 2);
        const teamWithMovingPlayer = isEqual(1, movingPlayerParams.newTeam)
            ? teamOnePlayers
            : teamTwoPlayers;
        const teamWithoutMovingPlayer = isEqual(1, movingPlayerParams.newTeam)
            ? teamTwoPlayers
            : teamOnePlayers;
        const updatedTeamArray = this.addToIndexOfTeam(teamWithMovingPlayer, movingPlayer, movingPlayerParams.listIndex);
        const playersWithPlayerKeys = {
            ...this.updateTeamPlayerIndexAndPlayerKeyForTeam(updatedTeamArray, room.players),
            ...this.updateTeamPlayerIndexAndPlayerKeyForTeam(teamWithoutMovingPlayer, room.players),
        };
        this.roomService.dispatchUpdateRoom({ players: playersWithPlayerKeys });
    }

    private updateTeamPlayerIndexAndPlayerKeyForTeam(team: any[], allPlayers: any[]) {
        return reduce(team, (result: any, player: any, index: number) => {
            result[this.playerService.getPlayerKey(allPlayers, player.name)] = {
                ...player,
                teamPlayerIndex: index,
            };
            return result;
        }, {});
    }

    public roomIsReadyToStart(room: any): boolean {
        const teamOnePlayers = filter(room.players, (player: any) => 1 === player.team);
        const teamTwoPlayers = filter(room.players, (player: any) => 2 === player.team);
        const isEvenTeams = isEqual(get(teamOnePlayers, 'length'), get(teamTwoPlayers, 'length'));
        const roomIsReady = every(room.players, player => player.ready);
        return roomIsReady
            && isEvenTeams;
    }

    private removeFromTeam(players, playerToRemove) {
        return filter(players, player => !isEqual(player.name, playerToRemove));
    }

    private addToIndexOfTeam(players, playerToAdd, index) {
        return slice(players, 0, index).concat([playerToAdd]).concat(slice(players, index, players.length));
    }

    dragStart(data: DataTransfer) {
        this.dataToTransfer = data;
    }

    switchTeams(user: Player) {
        const newTeam = 1 === user.team
            ? 2
            : 1;
        this.playerService.dispatchUpdatePlayer({ ...user, team: newTeam });
        this.playerState.pipe(
            rxjsFilter((playerState: any) => !isEqual(user.team, playerState.team)),
            take(1),
            mergeMap((player: any) => {
                return this.roomState.pipe(
                    take(1),
                    rxjsMap((room: any) => {
                        const roomPlayers = map(room.players, (roomPlayer: Player, key: string) => ({
                            ...roomPlayer,
                            id: key,
                        }));
                        const teamPlayers = filter(roomPlayers, (teamPlayer: Player) => isEqual(teamPlayer.team, newTeam));
                        const teamPlayerIndex = findIndex(teamPlayers, (teamPlayer: Player) => isEqual(teamPlayer.id, player.id));
                        return this.playerService.dispatchUpdatePlayer({ ...player, teamPlayerIndex: teamPlayerIndex });
                    }),
                );
            }),
        ).subscribe();
    }

    showRules() {
        const config = {
            autoFocus: false,
            height: '100%',
            width: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
        };
        this.dialog.open(DialogRulesComponent, config);
    }
}
