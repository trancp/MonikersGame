import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { take, concatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { ToastService } from '../toast/toast.service';

import { Room } from '../interfaces/room.model';
import { Player } from '../interfaces/player.model';

import get from 'lodash-es/get';

@Injectable()
export class ReadyUserGuardService implements CanActivate {
    constructor(private router: Router,
                private playerService: PlayerService,
                private roomService: RoomService,
                private toastService: ToastService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const slug = route.paramMap.get('slug');
        const roomCode = route.paramMap.get('code');
        return this.roomService.getRoomByCode(roomCode)
            .pipe(
                take(1),
                concatMap((room: Room) => {
                    return this.playerService.getPlayerByName(room, slug)
                        .pipe(
                            take(1),
                            map((player: Player) => {
                                if (player.ready) {
                                    return true;
                                }
                                if (get(player, 'words.length', 0)) {
                                    this.playerService.updatePlayerProperties(player, { ready: true });
                                    return true;
                                }
                                setTimeout(() => this.router.navigate([room.code, player.slug, 'words']));
                                return false;
                            }),
                            catchError(() => {
                                this.toastService.showError('Player does not exist!');
                                setTimeout(() => this.router.navigate(['/']));
                                return of(false);
                            }),
                        );
                }),
            );
    }
}
