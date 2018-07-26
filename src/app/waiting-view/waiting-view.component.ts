import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { AppState } from '../app.state';
import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';

import isEmpty from 'lodash-es/isEmpty';

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
    isLoading = false;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService,
                private router: Router,
                private store: Store<AppState>) {
        this.paramMapSubscription = this.route.paramMap
            .subscribe((params: ParamMap) => {
                const name = params.get('name');
                this.playerService.dispatchGetPlayer(name);
                this.roomSubscription = this.roomState.pipe(
                    filter((room: Room) => room.started),
                    take(1),
                    tap((room: Room) => this.router.navigate(['game', room.code, name])),
                ).subscribe();
                this.routeGuardService.checkExistingUser();
                this.playerState = this.store.select('player');
            });
        this.playerState.pipe(
            filter((playerState: Player) => !isEmpty(playerState) && !playerState.ready && !playerState.loading),
            take(1),
            tap(() => this.playerService.dispatchUpdatePlayer({ ready: true })),
        ).subscribe();
    }

    ngOnInit() {
        this.isLoading = true;
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap(() => {
                   this.isLoading = false;
                }),
            );
    }

    ngOnDestroy(): void {
        this.roomSubscription.unsubscribe();
        this.paramMapSubscription.unsubscribe();
    }
}
