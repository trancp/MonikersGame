import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';

import isEmpty from 'lodash-es/isEmpty';

@Injectable()
export class RouteGuardService {

    constructor(private router: Router) {
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
                    return this.router.navigate([room.code, player.slug, 'words']);
                }
                return this.router.navigate([room.code, player.slug, 'words']);
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
            tap(([room, player]: [Room, Player]) => this.router.navigate([room.code, player.slug, 'over'])),
        ).subscribe();
    }
}
