import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { Player } from '../interfaces/player.model';
import { ToastService } from '../toast/toast.service';
import { Room } from '../interfaces/room.model';

import isEmpty from 'lodash-es/isEmpty';

@Injectable()
export class RouteGuardService {

    constructor(private router: Router,
                private toastService: ToastService) {
    }

    checkExistingUser(playerState: any): void {
        playerState.pipe(
            filter((player: Player) => !isEmpty(player) && !player.loading),
            take(1),
            tap(((player: Player) => {
                    if (!player.id) {
                        this.toastService.showError('Player does not exist!');
                        return this.router.navigate(['/']);
                    }
                    return true;
                }),
            ),
        ).subscribe();
    }

    returnToWordsFormViewOnPlayAgain(roomState: any, playerState: any) {
        combineLatest([roomState, playerState]).pipe(
            filter(([room, player]: [Room, Player]) => {
                const roomIsNotStarted = !isEmpty(room) && !room.loading && !room.started;
                const playerIsLoaded = !isEmpty(player) && !player.loading;
                return roomIsNotStarted && playerIsLoaded;
            }),
            take(1),
            tap(([room, player]: [Room, Player]) => {
                if (player.vip) {
                    return this.router.navigate(['/create', room.code, player.name, 'words']);
                }
                return this.router.navigate(['/join', room.code, player.name, 'words']);
            }),
        ).subscribe();
    }

    goToGameOverViewOnGameOverStatus(roomState: any, playerState: any) {
        combineLatest([roomState, playerState]).pipe(
            filter(([room, player]: [Room, Player]) => {
                const gameIsOver = !isEmpty(room) && !room.loading && room.gameOver;
                const playerIsLoaded = !isEmpty(player) && !player.loading;
                return gameIsOver && playerIsLoaded;
            }),
            take(1),
            tap(([room, player]: [Room, Player]) => this.router.navigate(['/game', room.code, player.name, 'over'])),
        ).subscribe();
    }
}
