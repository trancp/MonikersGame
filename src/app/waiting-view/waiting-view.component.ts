import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';

const WAITING_TEXT = [
    `${'<div>'}Hey,${'</div>'}${'<div>'}sit back and${'</div>'}${'<div>'}fucking chill...${'</div>'}`,
    `${'<div>'}Game${'</div>'}${'<div>'}Is starting${'</div>'}${'<div>'}soon bro.${'</div>'}`,
    `${'<div>'}Calm${'</div>'}${'<div>'}the fuck${'</div>'}${'<div>'}down.${'</div>'}`,
];

@Component({
    selector: 'app-waiting-view',
    templateUrl: './waiting-view.component.html',
    styleUrls: ['./waiting-view.component.scss'],
})
export class WaitingViewComponent implements OnDestroy, OnInit {
    playerState: Observable<Player>;
    roomState: Observable<Room>;
    WAITING_TEXT: string[] = WAITING_TEXT;
    roomSubscription: Subscription;
    paramMapSubscription: Subscription;
    isLoading = true;
    playerIsLoading = true;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService,
                private router: Router) {
        this.paramMapSubscription = this.route.paramMap
            .subscribe(() => {
                this.roomSubscription = this.roomState.pipe(
                    filter((room: Room) => room.started),
                    take(1),
                    tap((room: Room) => this.router.navigate(['game', room.code, name])),
                ).subscribe();
                this.routeGuardService.checkExistingUser();
            });
    }

    ngOnInit() {
        const name = this.route.snapshot.paramMap.get('name');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap((room: Room) => {
                    this.getPlayerByNameForRoom(room, name);
                   this.isLoading = false;
                }),
            );
    }

    ngOnDestroy(): void {
        this.roomSubscription.unsubscribe();
        this.paramMapSubscription.unsubscribe();
    }

    getPlayerByNameForRoom(room: Room, name: string) {
        this.playerState = this.playerService.getPlayerByName(room, name)
            .pipe(
                tap((player: Player) => {
                    this.playerIsLoading = false;
                    this.playerService.updatePlayerProperties(player, { ready: true });
                }),
            );
    }
}
