import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import isEmpty from 'lodash-es/isEmpty';
import { AppState } from '../app.state';
import { Player } from '../interfaces/player.model';
import { ToastService } from '../toast/toast.service';

@Injectable()
export class RouteGuardService {

    constructor(private router: Router,
                private store: Store<AppState>,
                private toastService: ToastService) {
    }

    checkExistingUser(): void {
        this.store.select('player').pipe(
            filter((playerState: Player) => !isEmpty(playerState) && !playerState.loading),
            take(1),
            tap(((playerState: Player) => {
                    if (!playerState.id) {
                        this.toastService.showError('Player does not exist!');
                        return this.router.navigate(['/']);
                    }
                    return true;
                }),
            ),
        ).subscribe();
    }

    returnToWordsFormViewOnPlayAgain() {
        combineLatest([this.store.select('room'), this.store.select('player')]).pipe(
            filter(([roomState, playerState]) => {
                const roomIsNotStarted = !isEmpty(roomState) && !roomState.loading && !roomState.started;
                const playerIsLoaded = !isEmpty(playerState) && !playerState.loading;
                return roomIsNotStarted && playerIsLoaded;
            }),
            take(1),
            tap(([roomState, playerState]) => {
                if (playerState.vip) {
                    return this.router.navigate(['/create', roomState.code, playerState.name, 'words']);
                }
                return this.router.navigate(['/join', roomState.code, playerState.name, 'words']);
            }),
        ).subscribe();
    }

    goToGameOverViewOnGameOverStatus() {
        combineLatest([this.store.select('room'), this.store.select('player')]).pipe(
            filter(([roomState, playerState]) => {
                const gameIsOver = !isEmpty(roomState) && !roomState.loading && roomState.gameOver;
                const playerIsLoaded = !isEmpty(playerState) && !playerState.loading;
                return gameIsOver && playerIsLoaded;
            }),
            take(1),
            tap(([roomState, playerState]) => this.router.navigate(['/game', roomState.code, playerState.name, 'over'])),
        ).subscribe();
    }
}
