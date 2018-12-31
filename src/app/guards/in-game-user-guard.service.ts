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
export class InGameUserGuardService implements CanActivate {
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
                                if (player.ready && get(player, 'words.length', 0) && room.started) {
                                    setTimeout(() => this.router.navigate([room.code, player.slug, 'game']));
                                    return false;
                                }
                                this.playerService.updatePlayerProperties(player, { ready: false });
                                return true;
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
