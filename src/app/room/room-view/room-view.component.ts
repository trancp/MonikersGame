declare let window: any;

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter as rxjsFilter, map as rxjsMap, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {Location} from '@angular/common';

import { WordsService } from '../../words/words.service';

import { RoomService } from '../room.service';
import { PlayerService } from '../../player/player.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { DialogRulesComponent } from '../../dialog/dialog-rules/dialog-rules.component';

import { Room } from '../../interfaces/room.model';
import { Player } from '../../interfaces/player.model';
import { DataTransfer } from '../../interfaces/data-transfer.model';
import { getTeamPlayers, getPlayerKey } from '../../player/player.helpers';

import every from 'lodash-es/every';
import filter from 'lodash-es/filter';
import findIndex from 'lodash-es/findIndex';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import reduce from 'lodash-es/reduce';
import slice from 'lodash-es/slice';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
export class RoomViewComponent implements OnInit, OnDestroy {
    roomState: BehaviorSubject<Room> = new BehaviorSubject({ loading: true });
    playerState: BehaviorSubject<Player> = new BehaviorSubject({ loading: true });
    dataToTransfer: DataTransfer;
    GLOBAL_WORD_BANK: string[];
    componentDestroy = new Subject();

    constructor(private dialog: MatDialog,
                private location: Location,
                private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private router: Router,
                private roomService: RoomService,
                private playerService: PlayerService,
                private wordsService: WordsService) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roomState.next(room);
                    this.goToGameViewOnGameStarted(slug);
                    this.getPlayerByNameForRoom(room, slug)
                        .pipe(
                            takeUntil(this.componentDestroy),
                            tap((player: Player) => {
                                this.playerState.next(player);
                            }),
                        )
                        .subscribe();
                }),
            ).subscribe();
        this.wordsService.getAllWordsFromDb()
            .pipe(
                takeUntil(this.componentDestroy),
                rxjsMap((words: string[]) => {
                    this.GLOBAL_WORD_BANK = words;
                }),
            ).subscribe();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    public goBack() {
        return 1 === window.history.length
            ? this.router.navigate(['/'])
            : this.location.back();
    }

    public goToGame(room: any, user: Player): void {
        if (!this.roomIsReadyToStart(room)) {
            return;
        }
        this.roomService.addToGlobalWordBank(room.words, this.GLOBAL_WORD_BANK);
        this.roomService.startGame(room);
        this.router.navigate([room.code, user.slug, 'game']);
    }

    public goToGameViewOnGameStarted(slug: string) {
        this.roomState.pipe(
            rxjsFilter((room: Room) => room.started),
            take(1),
            tap((room: Room) => this.router.navigate([room.code, slug, 'game'])),
        ).subscribe();
    }

    public switchPlayerToNewTeam(movingPlayerParams: ImovingPlayer, room: any): void {
        const movingPlayer = {
            ...movingPlayerParams.player,
            team: movingPlayerParams.newTeam,
        };
        const playersWithoutMovingPlayer = filter(room.players, (player: any) => !isEqual(player.slug, movingPlayer.slug));
        const playersWithIndexing = map(playersWithoutMovingPlayer, (player: any) => player);
        const teamOnePlayers = getTeamPlayers(playersWithIndexing, 1);
        const teamTwoPlayers = getTeamPlayers(playersWithIndexing, 2);
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
        this.roomService.updateRoomProperties(room, { players: playersWithPlayerKeys });
    }

    private updateTeamPlayerIndexAndPlayerKeyForTeam(team: any[], allPlayers: any[]) {
        return reduce(team, (result: any, player: any, index: number) => {
            result[getPlayerKey(allPlayers, player.slug)] = {
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
        return filter(players, player => !isEqual(player.slug, playerToRemove));
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
        this.playerService.updatePlayerProperties(user, { ...user, team: newTeam });
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
                        return this.playerService.updatePlayerProperties(player, {
                            ...player,
                            teamPlayerIndex: teamPlayerIndex,
                        });
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

    getPlayerByNameForRoom(room: Room, slug: string) {
        return this.playerService.getPlayerByName(room, slug)
            .pipe(
                tap((player: Player) => {
                    this.playerService.updatePlayerProperties(player, { ready: true });
                }),
                this.routeGuardService.invalidUserError(),
            );
    }

    removePlayerFromRoom(player: Player) {
        const room = this.roomState.getValue();
        return this.roomService.removePlayerFromRoom(room, player);
    }
}
